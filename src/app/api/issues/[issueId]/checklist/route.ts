import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params
  const body = await request.json()
  const { title } = body

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }

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

  const maxSort = await db.checklistItem.aggregate({
    where: { issueId },
    _max: { sortOrder: true },
  })

  const item = await db.checklistItem.create({
    data: {
      title,
      issueId,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1000,
    },
  })

  return NextResponse.json(item, { status: 201 })
}
