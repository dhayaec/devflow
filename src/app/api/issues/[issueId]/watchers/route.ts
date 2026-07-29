import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params

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

  const existing = await db.issueWatcher.findUnique({
    where: { issueId_userId: { issueId, userId: session.user.id } },
  })
  if (!existing) {
    await db.issueWatcher.create({
      data: { issueId, userId: session.user.id },
    })
  }

  return NextResponse.json({ watching: true })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params

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

  await db.issueWatcher.deleteMany({
    where: { issueId, userId: session.user.id },
  })

  return NextResponse.json({ watching: false })
}
