import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { messageId } = await params

  const message = await db.message.findUnique({ where: { id: messageId } })
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 })
  }
  if (message.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Cannot edit another user's message" },
      { status: 403 },
    )
  }

  const body = await _request.json()
  const updated = await db.message.update({
    where: { id: messageId },
    data: { content: body.content, isEdited: true },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { messageId } = await params

  const message = await db.message.findUnique({ where: { id: messageId } })
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 })
  }
  if (message.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete another user's message" },
      { status: 403 },
    )
  }

  await db.message.delete({ where: { id: messageId } })
  return NextResponse.json({ success: true })
}
