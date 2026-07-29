import { auth } from "@/auth"
import { checkPermission } from "@/server/authorization"
import type { Permission } from "@/config/permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  permission: Permission
  organizationId: string
}

export async function PermissionGuard({
  children,
  fallback = null,
  permission,
  organizationId,
}: PermissionGuardProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return <>{fallback}</>
  }

  const hasPermission = await checkPermission(
    session.user.id,
    organizationId,
    permission,
  )

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
