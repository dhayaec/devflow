import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Not authenticated", { status: 401 })
  }

  const userId = request.nextUrl.searchParams.get("userId")
  if (!userId) {
    return new Response("userId required", { status: 400 })
  }

  if (userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("data: connected\n\n"))

      const interval = setInterval(async () => {
        try {
          const count = await db.notification.count({
            where: { userId, isRead: false },
          })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ totalUnread: count })}\n\n`))
        } catch {
          controller.enqueue(encoder.encode("data: error\n\n"))
        }
      }, 5000)

      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
