import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { KanbanBoard } from "@/components/projects/kanban-board"
import { BoardActions } from "./board-actions"

export default async function BoardPage({
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

  const issues = await db.issue.findMany({
    where: { projectId: project.id },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      assignee: { select: { id: true, name: true, image: true } },
    },
    orderBy: { sortOrder: "asc" },
  })

  const issueCounts = await db.issue.groupBy({
    by: ["status"],
    where: { projectId: project.id },
    _count: true,
  })
  const total = issues.length
  const doneCount =
    issueCounts.find((c) => c.status === "done")?._count ?? 0
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const members = await db.membership.findMany({
    where: { organizationId: org.id },
    include: { user: { select: { id: true, name: true } } },
  })

  const sprints = await db.sprint.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Board</h1>
          <p className="text-sm text-muted-foreground">
            {total} issues &middot; {doneCount} done ({pct}%)
          </p>
        </div>
        <BoardActions
          projectId={project.id}
          orgSlug={orgSlug}
          projectSlug={projectSlug}
          members={members.map((m) => ({ id: m.userId, name: m.user.name }))}
          sprints={sprints.map((s) => ({ id: s.id, title: s.title }))}
        />
      </div>

      <KanbanBoard issues={issues} projectId={project.id} />
    </div>
  )
}
