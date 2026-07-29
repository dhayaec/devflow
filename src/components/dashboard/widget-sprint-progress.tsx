import { db } from "@/lib/db"

export async function WidgetSprintProgress({
  organizationId,
}: {
  organizationId: string
}) {
  const activeSprints = await db.sprint.findMany({
    where: {
      project: { organizationId },
      status: "active",
    },
    include: {
      project: { select: { name: true } },
      _count: { select: { issues: true } },
    },
    take: 5,
  })

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Active Sprints</h3>
      {activeSprints.length === 0 ? (
        <p className="text-xs text-muted-foreground">No active sprints</p>
      ) : (
        <div className="space-y-3">
          {activeSprints.map((sprint) => (
            <div key={sprint.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate">{sprint.title}</span>
                <span className="text-xs text-muted-foreground">
                  {sprint._count.issues} issues
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{sprint.project.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
