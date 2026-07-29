import { NextRequest } from "next/server"
import { jobManager } from "@/lib/job-manager"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId")
  if (!jobId) {
    return new Response("jobId required", { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", jobId })}\n\n`))

      const onProgress = (id: string, progress: number, log?: string) => {
        if (id !== jobId) return
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "progress", progress, log })}\n\n`),
        )
      }

      const onComplete = (id: string, result: unknown) => {
        if (id !== jobId) return
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "complete", result })}\n\n`),
        )
        controller.close()
      }

      const onFail = (id: string, error: string) => {
        if (id !== jobId) return
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error })}\n\n`),
        )
        controller.close()
      }

      const onCancel = (id: string) => {
        if (id !== jobId) return
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "cancelled" })}\n\n`),
        )
        controller.close()
      }

      jobManager.on("progress", onProgress)
      jobManager.on("complete", onComplete)
      jobManager.on("fail", onFail)
      jobManager.on("cancel", onCancel)

      request.signal.addEventListener("abort", () => {
        jobManager.off("progress", onProgress)
        jobManager.off("complete", onComplete)
        jobManager.off("fail", onFail)
        jobManager.off("cancel", onCancel)
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
