import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get("organizationId")

  if (!organizationId) {
    return NextResponse.json({ error: "organizationId is required" }, { status: 400 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const channels = await db.channel.findMany({
    where: {
      organizationId,
      OR: [
        { isPrivate: false },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(channels)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, topic, description, organizationId, isPrivate, memberIds } = body

  if (!name || !organizationId) {
    return NextResponse.json(
      { error: "name and organizationId are required" },
      { status: 400 },
    )
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId },
    },
    include: {
      role: {
        include: { rolePermissions: { include: { permission: true } } },
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const canCreate = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "channel.create",
  )
  if (!canCreate) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const existing = await db.channel.findUnique({
    where: { organizationId_name: { organizationId, name } },
  })
  if (existing) {
    return NextResponse.json({ error: "Channel already exists" }, { status: 409 })
  }

  const channel = await db.channel.create({
    data: {
      name,
      topic,
      description,
      organizationId,
      isPrivate: isPrivate ?? false,
      createdById: session.user.id,
      members: {
        create: [
          { userId: session.user.id },
          ...(memberIds?.filter((id: string) => id !== session.user!.id).map((id: string) => ({ userId: id })) ?? []),
        ],
      },
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      _count: { select: { messages: true } },
    },
  })

  return NextResponse.json(channel, { status: 201 })
}
