import { NextRequest, NextResponse } from "next/server"
import { jobManager } from "@/lib/job-manager"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const jobId = request.nextUrl.searchParams.get("jobId")
  if (jobId) {
    const job = jobManager.get(jobId)
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })
    return NextResponse.json(job)
  }

  const type = request.nextUrl.searchParams.get("type") ?? undefined
  const jobs = jobManager.list(type)
  return NextResponse.json(jobs)
}
