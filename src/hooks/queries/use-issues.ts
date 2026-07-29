"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useIssueStore } from "@/stores/issue-store"
import type { Issue } from "@/types/issue"

interface UseIssuesParams {
  projectId: string
  sprintId?: string
  status?: string
  assigneeId?: string
}

export function useIssues({ projectId, sprintId, status, assigneeId }: UseIssuesParams) {
  const setIssues = useIssueStore((s) => s.setIssues)

  return useQuery<Issue[]>({
    queryKey: ["issues", projectId, sprintId, status, assigneeId],
    queryFn: async () => {
      const params = new URLSearchParams({ projectId })
      if (sprintId) params.set("sprintId", sprintId)
      if (status) params.set("status", status)
      if (assigneeId) params.set("assigneeId", assigneeId)

      const res = await fetch(`/api/issues?${params}`)
      if (!res.ok) throw new Error("Failed to fetch issues")
      const data = await res.json()
      setIssues(data)
      return data
    },
  })
}

export function useIssue(issueId: string) {
  return useQuery<Issue>({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const res = await fetch(`/api/issues/${issueId}`)
      if (!res.ok) throw new Error("Failed to fetch issue")
      return res.json()
    },
    enabled: !!issueId,
  })
}

export function useCreateIssue() {
  const queryClient = useQueryClient()
  const addIssue = useIssueStore((s) => s.addIssue)

  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      type?: string
      priority?: string
      status?: string
      projectId: string
      sprintId?: string
      assigneeId?: string
    }) => {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create issue")
      return res.json()
    },
    onSuccess: (issue) => {
      addIssue(issue)
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
}

export function useUpdateIssue() {
  const queryClient = useQueryClient()
  const updateIssue = useIssueStore((s) => s.updateIssue)

  return useMutation({
    mutationFn: async ({
      issueId,
      data,
    }: {
      issueId: string
      data: Record<string, unknown>
    }) => {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update issue")
      return res.json()
    },
    onSuccess: (issue) => {
      updateIssue(issue.id, issue)
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id] })
    },
  })
}

export function useDeleteIssue() {
  const queryClient = useQueryClient()
  const removeIssue = useIssueStore((s) => s.removeIssue)

  return useMutation({
    mutationFn: async (issueId: string) => {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete issue")
    },
    onSuccess: (_data, issueId) => {
      removeIssue(issueId)
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
}
