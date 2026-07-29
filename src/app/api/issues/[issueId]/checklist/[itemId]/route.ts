import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string; itemId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId, itemId } = await params
  const body = await request.json()

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    select: { project: { select: { organizationId: true } } },
  })
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: issue.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const updated = await db.checklistItem.update({
    where: { id: itemId },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.isChecked !== undefined && { isChecked: body.isChecked }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string; itemId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { itemId } = await params

  const item = await db.checklistItem.findUnique({
    where: { id: itemId },
    include: { issue: { select: { project: { select: { organizationId: true } } } } },
  })
  if (!item) {
    return NextResponse.json({ error: "Checklist item not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: item.issue.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  await db.checklistItem.delete({ where: { id: itemId } })

  return NextResponse.json({ success: true })
}
