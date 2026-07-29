import { db } from "@/lib/db"

export async function IssueStats({ projectId }: { projectId: string }) {
  const issues = await db.issue.findMany({
    where: { projectId, isArchived: false },
    select: { status: true, priority: true, type: true },
  })

  const byStatus = issues.reduce(
    (acc, i) => {
      acc[i.status] = (acc[i.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const byPriority = issues.reduce(
    (acc, i) => {
      acc[i.priority] = (acc[i.priority] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = issues.length

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Issue Breakdown</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
      <p className="text-xs text-muted-foreground mb-2">By Status</p>
          <div className="space-y-1.5">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 text-xs">
                <span className="w-20 text-muted-foreground truncate">{status}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">By Priority</p>
          <div className="space-y-1.5">
            {Object.entries(byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-2 text-xs">
                <span className="w-20 text-muted-foreground truncate">{priority}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
