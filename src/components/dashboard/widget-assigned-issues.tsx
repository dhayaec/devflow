import { db } from "@/lib/db"
import Link from "next/link"
import { auth } from "@/auth"

export async function WidgetAssignedIssues({
  organizationId,
  orgSlug,
}: {
  organizationId: string
  orgSlug: string
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const issues = await db.issue.findMany({
    where: {
      assigneeId: session.user.id,
      project: { organizationId },
      isArchived: false,
      status: { notIn: ["done", "cancelled"] },
    },
    include: { project: { select: { slug: true, name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">My Open Issues</h3>
      {issues.length === 0 ? (
        <p className="text-xs text-muted-foreground">No assigned issues</p>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/${orgSlug}/projects/${issue.project.slug}/issues/${issue.id}`}
              className="block rounded-md p-2 hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm font-medium truncate">{issue.title}</p>
              <p className="text-xs text-muted-foreground">
                {issue.project.name} · {issue.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
