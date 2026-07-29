"use client"

import { KanbanColumn } from "./kanban-column"

interface Issue {
  id: string
  title: string
  status: string
  priority: string
  assignee?: { name: string | null; image: string | null } | null
}

interface KanbanBoardProps {
  issues: Issue[]
}

const COLUMNS = [
  { title: "Backlog", status: "backlog", color: "bg-gray-400" },
  { title: "To Do", status: "todo", color: "bg-blue-500" },
  { title: "In Progress", status: "in_progress", color: "bg-amber-500" },
  { title: "Review", status: "review", color: "bg-purple-500" },
  { title: "Done", status: "done", color: "bg-emerald-500" },
  { title: "Cancelled", status: "cancelled", color: "bg-red-500" },
]

export function KanbanBoard({ issues }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          color={col.color}
          issues={issues.filter((i) => i.status === col.status)}
        />
      ))}
    </div>
  )
}
