import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100)
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  const where = {
    userId: session.user.id,
    ...(unreadOnly ? { isRead: false } : {}),
  } as const

  const [notifications, totalUnread] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.notification.count({
      where: { userId: session.user.id, isRead: false },
    }),
  ])

  return NextResponse.json({ notifications, totalUnread })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { notificationId, markAll } = body

  if (markAll) {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })
  } else if (notificationId) {
    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  }

  return NextResponse.json({ success: true })
}
