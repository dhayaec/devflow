import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getStorageConfig, createUploadKey } from "@/lib/upload"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { fileName, mimeType, fileSize, projectId, issueId, commentId } = body

  if (!fileName || !mimeType || !fileSize || !projectId) {
    return NextResponse.json(
      { error: "fileName, mimeType, fileSize, and projectId are required" },
      { status: 400 },
    )
  }

  const config = getStorageConfig()
  if (!config.isConfigured) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 501 },
    )
  }

  const key = createUploadKey(session.user.id, projectId, fileName)

  return NextResponse.json({
    key,
    url: `${config.endpoint}/${config.bucket}/${key}`,
    fields: {
      key,
      bucket: config.bucket,
      "Content-Type": mimeType,
    },
  })
}
