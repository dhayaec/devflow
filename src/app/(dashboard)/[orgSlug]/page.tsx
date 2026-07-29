import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug } = await params

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    include: {
      _count: {
        select: { memberships: true, projects: true },
      },
    },
  })

  if (!org) notFound()

  const recentProjects = await db.project.findMany({
    where: { organizationId: org.id, isArchived: false },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{org.name}</h1>
        <p className="text-muted-foreground">{org.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Members</p>
          <p className="text-2xl font-bold">{org._count.memberships}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-2xl font-bold">{org._count.projects}</p>
        </div>
      </div>

      {recentProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border p-3 flex items-center gap-3"
              >
                <span className="font-medium">{project.name}</span>
                {project.description && (
                  <span className="text-sm text-muted-foreground">
                    {project.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
