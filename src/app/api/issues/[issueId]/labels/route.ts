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

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    select: { project: { select: { organizationId: true } } },
  })
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 })
  }

  const link = await db.issueLabel.create({
    data: { issueId, labelId: body.labelId },
    include: { label: true },
  })

  return NextResponse.json(link, { status: 201 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params
  const body = await request.json()

  await db.issueLabel.deleteMany({
    where: { issueId, labelId: body.labelId },
  })

  return NextResponse.json({ success: true })
}
