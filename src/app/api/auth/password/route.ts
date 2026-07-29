import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current password and new password are required" },
      { status: 400 },
    )
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 },
    )
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return NextResponse.json(
      { error: "No password set on this account. Use OAuth or password reset." },
      { status: 400 },
    )
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 403 },
    )
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)
  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return NextResponse.json({ success: true })
}
