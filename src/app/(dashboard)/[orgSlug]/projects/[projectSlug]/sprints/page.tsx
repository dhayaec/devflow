import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { SprintProgress } from "@/components/projects/sprint-progress"
import { CreateSprintDialog } from "@/components/sprints/create-sprint-dialog"

const statusLabels: Record<string, string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusColors = {
  planning: "warning" as const,
  active: "default" as const,
  completed: "success" as const,
  cancelled: "danger" as const,
}

export default async function SprintsPage({
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
  })
  if (!project) notFound()

  const sprints = await db.sprint.findMany({
    where: { projectId: project.id },
    include: {
      _count: { select: { issues: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const issueCounts = await db.issue.groupBy({
    by: ["sprintId", "status"],
    where: {
      sprintId: { in: sprints.map((s) => s.id) },
    },
    _count: true,
  })

  const sprintStats = issueCounts.reduce(
    (acc, cur) => {
      if (!cur.sprintId) return acc
      if (!acc[cur.sprintId]) acc[cur.sprintId] = { total: 0, done: 0 }
      acc[cur.sprintId].total += cur._count
      if (cur.status === "done") acc[cur.sprintId].done += cur._count
      return acc
    },
    {} as Record<string, { total: number; done: number }>,
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Sprints</h1>
          <p className="text-sm text-muted-foreground">
            {sprints.length} sprint{sprints.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateSprintDialog projectId={project.id} />
      </div>

      {sprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No sprints yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => {
            const stats = sprintStats[sprint.id] ?? { total: 0, done: 0 }
            return (
              <div
                key={sprint.id}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{sprint.title}</h3>
                    {sprint.goal && (
                      <p className="text-sm text-muted-foreground">
                        {sprint.goal}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={statusColors[sprint.status as keyof typeof statusColors] ?? "outline"}
                  >
                    {statusLabels[sprint.status] ?? sprint.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{stats.total} issues</span>
                  {sprint.startDate && (
                    <span>
                      Start: {new Date(sprint.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {sprint.endDate && (
                    <span>
                      End: {new Date(sprint.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {sprint.status === "active" && (
                  <SprintProgress
                    total={stats.total}
                    completed={stats.done}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
