import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const issueId = searchParams.get("issueId")

  if (!issueId) {
    return NextResponse.json({ error: "issueId is required" }, { status: 400 })
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

  const comments = await db.comment.findMany({
    where: { issueId, parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(comments)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { body: commentBody, issueId, parentId } = body

  if (!commentBody || !issueId) {
    return NextResponse.json(
      { error: "body and issueId are required" },
      { status: 400 },
    )
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

  const comment = await db.comment.create({
    data: {
      body: commentBody,
      issueId,
      userId: session.user.id,
      parentId: parentId ?? null,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
