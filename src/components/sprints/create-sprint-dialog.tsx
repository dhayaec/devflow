"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateSprintDialogProps {
  projectId: string
}

export function CreateSprintDialog({ projectId }: CreateSprintDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [goal, setGoal] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/sprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          goal: goal || undefined,
          projectId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to create sprint")
        return
      }

      setOpen(false)
      setTitle("")
      setGoal("")
      setStartDate("")
      setEndDate("")
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4" />
        Create Sprint
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader onClose={() => setOpen(false)}>
            Create Sprint
          </DialogHeader>

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
                placeholder="Sprint 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Optional sprint goal..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Sprint"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
