"use client"

import { useState, useEffect, useCallback } from "react"
import { KanbanColumn } from "./kanban-column"
import { useCollaboration } from "@/hooks/use-collaboration"
import { useUpdateIssue } from "@/hooks/queries/use-issues"
import { useSession } from "@/hooks/use-session"

interface Issue {
  id: string
  title: string
  status: string
  priority: string
  assignee?: { name: string | null; image: string | null } | null
}

interface KanbanBoardProps {
  issues: Issue[]
  projectId?: string
}

const COLUMNS = [
  { title: "Backlog", status: "backlog", color: "bg-gray-400" },
  { title: "To Do", status: "todo", color: "bg-blue-500" },
  { title: "In Progress", status: "in_progress", color: "bg-amber-500" },
  { title: "Review", status: "review", color: "bg-purple-500" },
  { title: "Done", status: "done", color: "bg-emerald-500" },
  { title: "Cancelled", status: "cancelled", color: "bg-red-500" },
]

export function KanbanBoard({ issues: initialIssues, projectId }: KanbanBoardProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)

  // Sync with server-side prop changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIssues(initialIssues)
  }, [initialIssues])

  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)
  const { data: session } = useSession()
  const updateIssue = useUpdateIssue()
  const userId = session?.user?.id
  const collab = useCollaboration(userId)

  // Join project room for real-time updates
  useEffect(() => {
    if (!projectId || !collab) return

    collab.kanban.joinProjectBoard(projectId)

    const unsub = collab.kanban.onKanbanMove((move) => {
      if (move.userId === userId) return
      setIssues((prev) =>
        prev.map((i) =>
          i.id === move.issueId ? { ...i, status: move.toStatus } : i,
        ),
      )
    })

    return () => {
      unsub?.()
      collab.kanban.leaveProjectBoard(projectId)
    }
  }, [projectId, collab, userId])

  const handleDragStart = useCallback(
    (e: React.DragEvent, issueId: string, currentStatus: string) => {
      e.dataTransfer.setData("text/plain", JSON.stringify({ issueId, currentStatus }))
      e.dataTransfer.effectAllowed = "move"
    },
    [],
  )

  const handleDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStatus(status)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverStatus(null)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, toStatus: string) => {
      e.preventDefault()
      setDragOverStatus(null)

      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"))
        const { issueId, currentStatus } = data as { issueId: string; currentStatus: string }
        if (currentStatus === toStatus) return

        // Optimistic update
        setIssues((prev) =>
          prev.map((i) => (i.id === issueId ? { ...i, status: toStatus } : i)),
        )

        // Broadcast to collaborators
        if (projectId && userId) {
          collab?.kanban.broadcastKanbanMove({
            issueId,
            projectId,
            fromStatus: currentStatus,
            toStatus,
            newSortOrder: 0,
            userId,
          })
        }

        // Persist
        await updateIssue.mutateAsync({
          issueId,
          data: { status: toStatus },
        })
      } catch {
        // Revert on error is handled by refetch
      }
    },
    [projectId, userId, updateIssue, collab],
  )

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          color={col.color}
          issues={issues.filter((i) => i.status === col.status)}
          isDragOver={dragOverStatus === col.status}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
