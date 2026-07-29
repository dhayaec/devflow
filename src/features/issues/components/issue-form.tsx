"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"

interface IssueFormProps {
  open: boolean
  onClose: () => void
  projectId: string
  orgSlug: string
  projectSlug: string
  members: { id: string; name: string | null }[]
  sprints: { id: string; title: string }[]
  defaultStatus?: string
  defaultSprintId?: string
}

export function IssueForm({
  open,
  onClose,
  projectId,
  orgSlug,
  projectSlug,
  members,
  sprints,
  defaultStatus,
  defaultSprintId,
}: IssueFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("task")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState(defaultStatus ?? "backlog")
  const [sprintId, setSprintId] = useState(defaultSprintId ?? "")
  const [assigneeId, setAssigneeId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          type,
          priority,
          status,
          projectId,
          sprintId: sprintId || undefined,
          assigneeId: assigneeId || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to create issue")
        return
      }

      const issue = await res.json()
      onClose()
      reset()
      router.push(
        `/${orgSlug}/projects/${projectSlug}/issues/${issue.id}`,
      )
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setTitle("")
    setDescription("")
    setType("task")
    setPriority("medium")
    setStatus(defaultStatus ?? "backlog")
    setSprintId(defaultSprintId ?? "")
    setAssigneeId("")
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="max-w-xl">
        <DialogHeader onClose={onClose}>Create Issue</DialogHeader>

        <DialogContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent p-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: "task", label: "Task" },
                  { value: "bug", label: "Bug" },
                  { value: "feature", label: "Feature" },
                  { value: "improvement", label: "Improvement" },
                  { value: "epic", label: "Epic" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={[
                  { value: "urgent", label: "Urgent" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: "backlog", label: "Backlog" },
                  { value: "todo", label: "To Do" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                  { value: "done", label: "Done" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
            </div>

            {sprints.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="sprint">Sprint</Label>
                <Select
                  id="sprint"
                  value={sprintId}
                  onChange={(e) => setSprintId(e.target.value)}
                  options={sprints.map((s) => ({
                    value: s.id,
                    label: s.title,
                  }))}
                  placeholder="No sprint"
                />
              </div>
            )}
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                id="assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                options={members.map((m) => ({
                  value: m.id,
                  label: m.name ?? "Unknown",
                }))}
                placeholder="Unassigned"
              />
            </div>
          )}
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Issue"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
