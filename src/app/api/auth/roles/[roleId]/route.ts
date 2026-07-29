import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { roleId } = await params
  const body = await request.json()
  const { name, description, permissionIds } = body

  const role = await db.role.findUnique({
    where: { id: roleId },
    include: { organization: true },
  })

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 })
  }

  const canManageRoles = await checkPermission(
    session.user.id,
    role.organizationId,
    Permissions.member_manage_roles,
  )

  if (!canManageRoles) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  if (role.isSystem) {
    return NextResponse.json({ error: "Cannot modify system roles" }, { status: 400 })
  }

  const updated = await db.role.update({
    where: { id: roleId },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(permissionIds && {
        rolePermissions: {
          deleteMany: {},
          create: permissionIds.map((permissionId: string) => ({
            permissionId,
          })),
        },
      }),
    },
    include: {
      rolePermissions: {
        include: { permission: true },
      },
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { roleId } = await params

  const role = await db.role.findUnique({
    where: { id: roleId },
  })

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 })
  }

  if (role.isSystem) {
    return NextResponse.json({ error: "Cannot delete system roles" }, { status: 400 })
  }

  const canManageRoles = await checkPermission(
    session.user.id,
    role.organizationId,
    Permissions.member_manage_roles,
  )

  if (!canManageRoles) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  await db.role.delete({ where: { id: roleId } })

  return NextResponse.json({ success: true })
}
