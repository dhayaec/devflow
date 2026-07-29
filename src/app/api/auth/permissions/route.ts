import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const permissions = await db.permission.findMany({
    orderBy: [{ category: "asc" }, { action: "asc" }],
  })

  return NextResponse.json(permissions)
}
