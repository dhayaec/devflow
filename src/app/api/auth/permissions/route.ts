import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const permissions = await db.permission.findMany({
    orderBy: [{ category: "asc" }, { action: "asc" }],
  })

  return NextResponse.json(permissions)
}
