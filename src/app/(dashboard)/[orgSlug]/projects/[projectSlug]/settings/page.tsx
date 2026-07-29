import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { ProjectSettingsForm } from "./project-settings-form"

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, projectSlug } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const project = await db.project.findUnique({
    where: {
      organizationId_slug: { slug: projectSlug, organizationId: org.id },
    },
    include: {
      lead: { select: { id: true, name: true, image: true } },
    },
  })
  if (!project) notFound()

  const members = await db.membership.findMany({
    where: { organizationId: org.id },
    include: { user: { select: { id: true, name: true } } },
  })

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Project Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your project configuration
        </p>
      </div>

      <ProjectSettingsForm
        project={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description ?? "",
          leadId: project.leadId ?? "",
          startDate: project.startDate?.toISOString().split("T")[0] ?? "",
          endDate: project.endDate?.toISOString().split("T")[0] ?? "",
          isArchived: project.isArchived,
        }}
        orgSlug={orgSlug}
        members={members.map((m) => ({ id: m.userId, name: m.user.name }))}
      />
    </div>
  )
}
