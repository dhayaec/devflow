"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3"
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="improvement">Improvement</option>
                <option value="epic">Epic</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {sprints.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="sprint">Sprint</Label>
                <select
                  id="sprint"
                  value={sprintId}
                  onChange={(e) => setSprintId(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3"
                >
                  <option value="">No sprint</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <select
                id="assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name ?? "Unknown"}
                  </option>
                ))}
              </select>
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
