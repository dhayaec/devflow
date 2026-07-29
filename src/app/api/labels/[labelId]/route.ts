import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ labelId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { labelId } = await params
  const label = await db.label.findUnique({
    where: { id: labelId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!label) {
    return NextResponse.json({ error: "Label not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: label.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const body = await request.json()
  const updated = await db.label.update({
    where: { id: labelId },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.color !== undefined && { color: body.color }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ labelId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { labelId } = await params
  const label = await db.label.findUnique({
    where: { id: labelId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!label) {
    return NextResponse.json({ error: "Label not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: label.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  await db.label.delete({ where: { id: labelId } })
  return NextResponse.json({ success: true })
}
