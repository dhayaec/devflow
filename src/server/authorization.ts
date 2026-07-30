import "server-only"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import type { Permission } from "@/config/permissions"

export async function getMemberPermissions(
  userId: string,
  organizationId: string,
): Promise<string[]> {
  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  })

  if (!membership) return []

  return membership.role.rolePermissions.map((rp: (typeof membership.role.rolePermissions)[number]) => rp.permission.action)
}

export async function checkPermission(
  userId: string,
  organizationId: string,
  permission: Permission,
): Promise<boolean> {
  const permissions = await getMemberPermissions(userId, organizationId)
  return permissions.includes(permission)
}

export async function requirePermission(
  organizationId: string,
  permission: Permission,
): Promise<{ authorized: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { authorized: false, error: "Not authenticated" }
  }

  const hasPermission = await checkPermission(
    session.user.id,
    organizationId,
    permission,
  )

  if (!hasPermission) {
    return { authorized: false, error: "Insufficient permissions" }
  }

  return { authorized: true }
}

export async function getOrganizationRoles(organizationId: string) {
  return db.role.findMany({
    where: { organizationId },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })
}

export async function createOrganizationRole(
  organizationId: string,
  data: {
    name: string
    description?: string
    permissionIds: string[]
  },
) {
  return db.role.create({
    data: {
      name: data.name,
      description: data.description,
      organizationId,
      rolePermissions: {
        create: data.permissionIds.map((permissionId) => ({
          permissionId,
        })),
      },
    },
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
    },
  })
}
