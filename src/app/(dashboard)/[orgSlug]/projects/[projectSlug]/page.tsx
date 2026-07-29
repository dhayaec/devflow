import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { SprintProgress } from "@/components/projects/sprint-progress"

const priorityColors = {
  urgent: "danger" as const,
  high: "warning" as const,
  medium: "default" as const,
  low: "secondary" as const,
}

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  cancelled: "Cancelled",
}

export default async function ProjectOverviewPage({
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
      _count: {
        select: { issues: true, sprints: true, labels: true, documents: true },
      },
    },
  })
  if (!project) notFound()

  const recentIssues = await db.issue.findMany({
    where: { projectId: project.id },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  })

  const activeSprint = await db.sprint.findFirst({
    where: { projectId: project.id, status: "active" },
    include: {
      _count: { select: { issues: true } },
    },
  })

  const issueCounts = await db.issue.groupBy({
    by: ["status"],
    where: { projectId: project.id },
    _count: true,
  })

  const statusSummary = issueCounts.reduce(
    (acc, cur) => {
      acc[cur.status] = cur._count
      return acc
    },
    {} as Record<string, number>,
  )

  const totalIssues = recentIssues.length
  const doneIssues = issueCounts.find((c) => c.status === "done")?._count ?? 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-muted-foreground">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {project.lead && (
            <div className="flex items-center gap-2">
              <Avatar
                src={project.lead.image}
                fallback={project.lead.name?.[0] ?? "L"}
                size="sm"
              />
              <span className="text-muted-foreground">
                Lead: {project.lead.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Total Issues</p>
          <p className="text-xl font-bold">{project._count.issues}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Sprints</p>
          <p className="text-xl font-bold">{project._count.sprints}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Labels</p>
          <p className="text-xl font-bold">{project._count.labels}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Documents</p>
          <p className="text-xl font-bold">{project._count.documents}</p>
        </div>
      </div>

      {/* Active Sprint */}
      {activeSprint && (
        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="font-semibold">Active Sprint: {activeSprint.title}</h2>
          {activeSprint.goal && (
            <p className="text-sm text-muted-foreground">
              Goal: {activeSprint.goal}
            </p>
          )}
          <SprintProgress
            total={activeSprint._count.issues}
            completed={doneIssues}
            label="Progress"
          />
        </div>
      )}

      {/* Status Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Issue Status</h2>
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{statusSummary[status] ?? 0}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Issues */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Issues</h2>
        <div className="space-y-2">
          {recentIssues.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No issues yet. Create your first issue from the Board or Backlog.
            </p>
          ) : (
            recentIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Badge
                  variant={
                    priorityColors[issue.priority as keyof typeof priorityColors] ??
                    "secondary"
                  }
                >
                  {issue.priority}
                </Badge>
                <span className="flex-1 text-sm font-medium">
                  {issue.title}
                </span>
                <Badge variant="outline">
                  {statusLabels[issue.status] ?? issue.status}
                </Badge>
                {issue.assignee && (
                  <Avatar
                    src={issue.assignee.image}
                    fallback={issue.assignee.name?.[0] ?? "?"}
                    size="sm"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
