"use client"

import { useEffect } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"
import { useIssueStore } from "@/stores/issue-store"
import { useQueryClient } from "@tanstack/react-query"

interface IssueRealtimeWrapperProps {
  issueId: string
  projectId: string
  userId: string
  children: React.ReactNode
}

export function IssueRealtimeWrapper({
  issueId,
  projectId,
  userId,
  children,
}: IssueRealtimeWrapperProps) {
  const collab = useCollaboration(userId)
  const updateIssue = useIssueStore((s) => s.updateIssue)
  const queryClient = useQueryClient()

  useEffect(() => {
    collab.issue.viewIssue(issueId)
    collab.kanban.joinProjectBoard(projectId)

    const unsubIssue = collab.issue.onIssueChanged((change) => {
      if (change.userId === userId) return
      if (change.issueId === issueId) {
        updateIssue(issueId, change.changes)
        queryClient.invalidateQueries({ queryKey: ["issue", issueId] })
      }
    })

    const unsubKanban = collab.kanban.onKanbanMove((move) => {
      if (move.issueId === issueId) {
        updateIssue(issueId, { status: move.toStatus })
        queryClient.invalidateQueries({ queryKey: ["issue", issueId] })
      }
    })

    return () => {
      unsubIssue?.()
      unsubKanban?.()
      collab.issue.stopViewingIssue(issueId)
      collab.kanban.leaveProjectBoard(projectId)
    }
  }, [issueId, projectId, userId, collab, updateIssue, queryClient])

  return <>{children}</>
}
