import Link from "next/link"
import { db } from "@/lib/db"

export async function WidgetStats({
  organizationId,
  orgSlug,
}: {
  organizationId: string
  orgSlug: string
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
      <StatCard label="Projects" value={projectCount} href={`/${orgSlug}/projects`} />
      <StatCard label="Total Issues" value={issueCount} href={`/${orgSlug}/projects`} />
      <StatCard label="Open Issues" value={openIssues} href={`/${orgSlug}/projects`} />
      <StatCard label="Active Sprints" value={sprintCount} href={`/${orgSlug}/projects`} />
      <StatCard label="Members" value={memberCount} href={`/${orgSlug}/members`} />
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border p-4 block cursor-pointer hover:bg-muted/30 transition-colors"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Link>
  )
}
