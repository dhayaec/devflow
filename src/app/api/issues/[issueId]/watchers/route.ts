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

  await db.issueWatcher.deleteMany({
    where: { issueId, userId: session.user.id },
  })

  return NextResponse.json({ watching: false })
}
