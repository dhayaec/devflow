import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

export default async function ProjectsPage({
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

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: org.id,
      },
    },
  })
  if (!membership) notFound()

  const projects = await db.project.findMany({
    where: { organizationId: org.id, isArchived: false },
    include: {
      lead: { select: { id: true, name: true, image: true } },
      _count: { select: { issues: true, sprints: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const members = await db.membership.findMany({
    where: { organizationId: org.id },
    include: { user: { select: { id: true, name: true } } },
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in{" "}
            {org.name}
          </p>
        </div>
        <CreateProjectDialog
          orgId={org.id}
          orgSlug={orgSlug}
          members={members.map((m) => ({ id: m.userId, name: m.user.name }))}
        />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No projects yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              orgSlug={orgSlug}
            />
          ))}
        </div>
      )}
    </div>
  )
}
