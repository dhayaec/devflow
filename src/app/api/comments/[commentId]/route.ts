import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { commentId } = await params

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      issue: { select: { project: { select: { organizationId: true } } } },
    },
  })
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }
  if (comment.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Cannot edit another user's comment" },
      { status: 403 },
    )
  }

  const body = await request.json()
  const updated = await db.comment.update({
    where: { id: commentId },
    data: { body: body.body, isEdited: true },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { commentId } = await params

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      issue: { select: { project: { select: { organizationId: true } } } },
    },
  })
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }
  if (comment.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete another user's comment" },
      { status: 403 },
    )
  }

  await db.comment.delete({ where: { id: commentId } })
  return NextResponse.json({ success: true })
}
