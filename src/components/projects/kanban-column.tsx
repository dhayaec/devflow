"use client"

interface Issue {
  id: string
  title: string
  priority: string
  assignee?: { name: string | null; image: string | null } | null
}

interface KanbanColumnProps {
  title: string
  status: string
  issues: Issue[]
  color: string
}

export function KanbanColumn({
  title,
  status,
  issues,
  color,
}: KanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <div className={`size-2 rounded-full ${color}`} />
        <span className="text-sm font-medium">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {issues.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {issues.map((issue) => (
          <KanbanCard key={issue.id} issue={issue} />
        ))}
        {issues.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No issues
          </p>
        )}
      </div>
    </div>
  )
}

function KanbanCard({ issue }: { issue: Issue }) {
  const priorityColor: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-amber-500",
    medium: "border-l-blue-500",
    low: "border-l-gray-400",
  }

  return (
    <div
      className={`rounded-lg border border-l-2 bg-background p-3 shadow-sm transition-shadow hover:shadow-md ${
        priorityColor[issue.priority] ?? "border-l-gray-400"
      }`}
    >
      <p className="text-sm leading-snug">{issue.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">
          {issue.priority}
        </span>
        {issue.assignee && (
          <span className="ml-auto text-xs text-muted-foreground">
            {issue.assignee.name ?? "Unassigned"}
          </span>
        )}
      </div>
    </div>
  )
}
