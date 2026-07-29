import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { checkPermission } from "@/server/authorization"
import { Permissions } from "@/config/permissions"

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug } = await params

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) notFound()

  const canManage = await checkPermission(
    session.user.id,
    org.id,
    Permissions.settings_manage,
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings</p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Organization Name</label>
          <p className="text-lg">{org.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Slug</label>
          <p className="text-lg">{org.slug}</p>
        </div>
        {org.description && (
          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-lg">{org.description}</p>
          </div>
        )}
        {!canManage && (
          <p className="text-sm text-muted-foreground">
            You have view-only access to settings.
          </p>
        )}
      </div>
    </div>
  )
}
