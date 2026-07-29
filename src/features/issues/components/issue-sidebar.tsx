"use client"

import { useRouter } from "next/navigation"
import { IssuePriority } from "./issue-priority"
import { IssueLabels } from "./issue-labels"
import { IssueWatchers } from "./issue-watchers"

interface Member {
  id: string
  name: string | null
}

interface Sprint {
  id: string
  title: string
  status: string
}

interface Label {
  id: string
  name: string
  color: string
}

interface WatcherUser {
  id: string
  name: string | null
  image: string | null
}

interface IssueSidebarProps {
  issueId: string
  projectId: string
  assignee: { id: string; name: string | null; image: string | null } | null
  sprint: Sprint | null
  priority: string
  status: string
  dueDate: string | null
  labels: { label: Label }[]
  watchers: { user: WatcherUser }[]
  allLabels: Label[]
  members: Member[]
  sprints: Sprint[]
  currentUserId: string
}

const statusOptions = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
]

export function IssueSidebar({
  issueId,
  assignee,
  sprint,
  priority,
  status,
  dueDate,
  labels,
  watchers,
  allLabels,
  members,
  sprints,
  currentUserId,
}: IssueSidebarProps) {
  const router = useRouter()

  const updateField = async (field: string, value: unknown) => {
    await fetch(`/api/issues/${issueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
    router.refresh()
  }

  const toggleLabel = async (labelId: string) => {
    const hasLabel = labels.some((l) => l.label.id === labelId)
    const method = hasLabel ? "DELETE" : "POST"
    await fetch(`/api/issues/${issueId}/labels`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labelId }),
    })
    router.refresh()
  }

  return (
    <div className="space-y-5 w-full max-w-64">
      {/* Status */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Status</label>
        <select
          value={status}
          onChange={(e) => updateField("status", e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <IssuePriority
        value={priority}
        onChange={(v) => updateField("priority", v)}
      />

      {/* Assignee */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Assignee</label>
        <select
          value={assignee?.id ?? ""}
          onChange={(e) =>
            updateField("assigneeId", e.target.value || null)
          }
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name ?? "Unknown"}
            </option>
          ))}
        </select>
      </div>

      {/* Sprint */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Sprint</label>
        <select
          value={sprint?.id ?? ""}
          onChange={(e) =>
            updateField("sprintId", e.target.value || null)
          }
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">No sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Due Date */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Due Date</label>
        <input
          type="date"
          value={dueDate?.split("T")[0] ?? ""}
          onChange={(e) =>
            updateField("dueDate", e.target.value || null)
          }
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {/* Labels */}
      <IssueLabels
        labels={labels}
        allLabels={allLabels}
        onToggleLabel={toggleLabel}
      />

      {/* Watchers */}
      <IssueWatchers
        watchers={watchers}
        issueId={issueId}
        currentUserId={currentUserId}
      />
    </div>
  )
}
