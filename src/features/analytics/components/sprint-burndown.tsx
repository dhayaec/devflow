import { db } from "@/lib/db"

export async function SprintBurndown({ sprintId }: { sprintId: string }) {
  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: {
      issues: {
        select: { status: true, estimate: true },
      },
    },
  })

  if (!sprint) return null

  const totalIssues = sprint.issues.length
  const doneIssues = sprint.issues.filter(
    (i) => i.status === "done" || i.status === "cancelled",
  ).length
  const totalEstimate = sprint.issues.reduce((sum, i) => sum + (i.estimate ?? 0), 0)
  const doneEstimate = sprint.issues
    .filter((i) => i.status === "done" || i.status === "cancelled")
    .reduce((sum, i) => sum + (i.estimate ?? 0), 0)

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Sprint Progress: {sprint.title}</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Issues</span>
            <span>{doneIssues}/{totalIssues}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: totalIssues > 0 ? `${(doneIssues / totalIssues) * 100}%` : "0%" }}
            />
          </div>
        </div>
        {totalEstimate > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Estimate (points)</span>
              <span>{doneEstimate}/{totalEstimate}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(doneEstimate / totalEstimate) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
