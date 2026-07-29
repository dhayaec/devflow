import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get("channelId")

  if (!channelId) {
    return NextResponse.json({ error: "channelId is required" }, { status: 400 })
  }

  const channel = await db.channel.findUnique({
    where: { id: channelId },
    select: { organizationId: true, isPrivate: true },
  })
  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: channel.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const cursor = searchParams.get("cursor")
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100)

  const messages = await db.message.findMany({
    where: { channelId, parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          reactions: true,
        },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = messages.length > limit
  const items = hasMore ? messages.slice(0, limit) : messages

  return NextResponse.json({
    messages: items.reverse(),
    nextCursor: hasMore ? items[0]?.id : null,
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { content, channelId, parentId } = body

  if (!content || !channelId) {
    return NextResponse.json(
      { error: "content and channelId are required" },
      { status: 400 },
    )
  }

  const channel = await db.channel.findUnique({
    where: { id: channelId },
    select: { organizationId: true, isPrivate: true },
  })
  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: channel.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  if (channel.isPrivate) {
    const channelMember = await db.channelMember.findUnique({
      where: { channelId_userId: { channelId, userId: session.user.id } },
    })
    if (!channelMember) {
      return NextResponse.json({ error: "Not a member of this channel" }, { status: 403 })
    }
  }

  const message = await db.message.create({
    data: {
      content,
      channelId,
      userId: session.user.id,
      parentId: parentId ?? null,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
  })

  return NextResponse.json(message, { status: 201 })
}
