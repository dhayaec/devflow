import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"
import crypto from "crypto"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  if (!session.user.email) {
    return NextResponse.json({ error: "No email on account" }, { status: 400 })
  }

  const invitations = await db.invitation.findMany({
    where: { email: session.user.email },
    include: {
      organization: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(invitations)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { email, organizationId, roleId, teamId } = body

  if (!email || !organizationId) {
    return NextResponse.json(
      { error: "email and organizationId are required" },
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
      { error: "User is already a member" },
      { status: 409 },
    )
  }

  const invitation = await db.invitation.create({
    data: {
      email,
      token: crypto.randomBytes(32).toString("hex"),
      organizationId,
      teamId,
      roleId,
      invitedById: session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  return NextResponse.json(invitation, { status: 201 })
}
