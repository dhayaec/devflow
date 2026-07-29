import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { documentId } = await params

  const document = await db.document.findUnique({
    where: { id: documentId },
    include: {
      user: { select: { id: true, name: true, image: true } },
      project: { select: { id: true, slug: true, organizationId: true } },
      parent: { select: { id: true, title: true } },
      children: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: document.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  return NextResponse.json(document)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { documentId } = await params

  const doc = await db.document.findUnique({
    where: { id: documentId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title
  if (body.content !== undefined) data.content = body.content
  if (body.isPublished !== undefined) data.isPublished = body.isPublished
  if (body.parentId !== undefined) data.parentId = body.parentId
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder

  const updated = await db.document.update({
    where: { id: documentId },
    data,
    include: {
      user: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { documentId } = await params
  await db.document.delete({ where: { id: documentId } })

  return NextResponse.json({ success: true })
}
