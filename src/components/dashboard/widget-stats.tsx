import { db } from "@/lib/db"

export async function WidgetStats({
  organizationId,
}: {
  organizationId: string
}) {
  const [projectCount, issueCount, memberCount, sprintCount] = await Promise.all([
    db.project.count({ where: { organizationId, isArchived: false } }),
    db.issue.count({
      where: { project: { organizationId }, isArchived: false },
    }),
    db.membership.count({ where: { organizationId } }),
    db.sprint.count({
      where: { project: { organizationId }, status: "active" },
    }),
  ])

  const openIssues = await db.issue.count({
    where: {
      project: { organizationId },
      isArchived: false,
      status: { notIn: ["done", "cancelled"] },
    },
  })

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <StatCard label="Projects" value={projectCount} />
      <StatCard label="Total Issues" value={issueCount} />
      <StatCard label="Open Issues" value={openIssues} />
      <StatCard label="Active Sprints" value={sprintCount} />
      <StatCard label="Members" value={memberCount} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
