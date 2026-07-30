import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, email, password, organizationId, roleId, userType } = body

  if (!email || !organizationId || !roleId) {
    return NextResponse.json(
      { error: "email, organizationId, and roleId are required" },
      { status: 400 },
    )
  }

  const canInvite = await checkPermission(
    session.user.id,
    organizationId,
    Permissions.member_invite,
  )

  if (!canInvite) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const existingMember = await db.membership.findFirst({
    where: {
      organizationId,
      user: { email },
    },
  })

  if (existingMember) {
    return NextResponse.json(
      { error: "User is already a member of this organization" },
      { status: 409 },
    )
  }

  const role = await db.role.findUnique({ where: { id: roleId } })
  if (!role || role.organizationId !== organizationId) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  let user = await db.user.findUnique({ where: { email } })

  if (user) {
    // Existing user — just add membership
    await db.membership.create({
      data: {
        userId: user.id,
        organizationId,
        roleId,
      },
    })
  } else {
    // New user — create account with password
    const hashedPassword = password
      ? await bcrypt.hash(password, 12)
      : undefined

    user = await db.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        emailVerified: password ? new Date() : undefined,
        userType: userType ?? "member",
      },
    })

    await db.membership.create({
      data: {
        userId: user.id,
        organizationId,
        roleId,
      },
    })
  }

  return NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    },
    { status: 201 },
  )
}
