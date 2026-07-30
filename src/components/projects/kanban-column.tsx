"use client"

import React from "react"

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
  isDragOver?: boolean
  onDragStart?: (e: React.DragEvent, issueId: string, currentStatus: string) => void
  onDragOver?: (e: React.DragEvent, status: string) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent, status: string) => void
}

export function KanbanColumn({
  title,
  status,
  issues,
  color,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex flex-1 min-w-0 flex-col rounded-lg border bg-muted/30 transition-colors max-h-full ${
        isDragOver ? "border-primary bg-primary/5" : ""
      }`}
      onDragOver={(e) => onDragOver?.(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, status)}
    >
      <div className="flex items-center gap-2 border-b px-2.5 py-2">
        <div className={`size-2 rounded-full ${color}`} />
        <span className="text-sm font-medium">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {issues.length}
        </span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto p-1.5 min-h-0">
        {issues.map((issue) => (
          <KanbanCard
            key={issue.id}
            issue={issue}
            status={status}
            onDragStart={onDragStart}
          />
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

function KanbanCard({
  issue,
  status,
  onDragStart,
}: {
  issue: Issue
  status: string
  onDragStart?: (e: React.DragEvent, issueId: string, currentStatus: string) => void
}) {
  const priorityColor: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-amber-500",
    medium: "border-l-blue-500",
    low: "border-l-gray-400",
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, issue.id, status)}
      className={`cursor-grab rounded-lg border border-l-[3px] bg-background p-2.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
        priorityColor[issue.priority] ?? "border-l-gray-400"
      }`}
    >
      <p className="text-sm leading-snug line-clamp-2">{issue.title}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-[10px] uppercase text-muted-foreground">
          {issue.priority}
        </span>
        {issue.assignee && (
          <span className="ml-auto text-xs text-muted-foreground truncate">
            {issue.assignee.name ?? "Unassigned"}
          </span>
        )}
      </div>
    </div>
  )
}
