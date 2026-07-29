import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { orgId } = await params

  const canView = await checkPermission(
    session.user.id,
    orgId,
    Permissions.organization_view,
  )

  if (!canView) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const org = await db.organization.findUnique({
    where: { id: orgId },
    include: {
      _count: {
        select: { memberships: true, projects: true, teams: true },
      },
    },
  })

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  return NextResponse.json(org)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { orgId } = await params
  const body = await request.json()

  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { id: true },
  })
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  const canEdit = await checkPermission(
    session.user.id,
    orgId,
    Permissions.organization_edit,
  )

  if (!canEdit) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const updated = await db.organization.update({
    where: { id: orgId },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.logo !== undefined && { logo: body.logo }),
    },
  })

  return NextResponse.json(updated)
}
