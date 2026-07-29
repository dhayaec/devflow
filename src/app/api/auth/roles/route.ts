import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get("organizationId")

  if (!organizationId) {
    return NextResponse.json({ error: "organizationId is required" }, { status: 400 })
  }

  const canView = await checkPermission(
    session.user.id,
    organizationId,
    Permissions.settings_view,
  )

  if (!canView) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const roles = await db.role.findMany({
    where: { organizationId },
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      _count: {
        select: { memberships: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(roles)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, organizationId, permissionIds } = body

  if (!name || !organizationId) {
    return NextResponse.json(
      { error: "name and organizationId are required" },
      { status: 400 },
    )
  }

  const canManageRoles = await checkPermission(
    session.user.id,
    organizationId,
    Permissions.member_manage_roles,
  )

  if (!canManageRoles) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const existing = await db.role.findFirst({
    where: { name, organizationId },
  })

  if (existing) {
    return NextResponse.json({ error: "Role already exists" }, { status: 409 })
  }

  const role = await db.role.create({
    data: {
      name,
      description,
      organizationId,
      rolePermissions: {
        create: (permissionIds ?? []).map((permissionId: string) => ({
          permissionId,
        })),
      },
    },
    include: {
      rolePermissions: {
        include: { permission: true },
      },
    },
  })

  return NextResponse.json(role, { status: 201 })
}
