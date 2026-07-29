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

interface CreateProjectDialogProps {
  orgId: string
  orgSlug: string
  members: { id: string; name: string | null }[]
}

export function CreateProjectDialog({
  orgId,
  orgSlug,
  members,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [leadId, setLeadId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateSlug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    setSlug(generateSlug(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          organizationId: orgId,
          leadId: leadId || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to create project")
        return
      }

      const project = await res.json()
      setOpen(false)
      setName("")
      setSlug("")
      setDescription("")
      setLeadId("")
      router.push(`/${orgSlug}/projects/${project.slug}`)
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Project
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader onClose={() => setOpen(false)}>
            Create Project
          </DialogHeader>

          <DialogContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="My Project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-project"
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short description..."
              />
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="lead">Project Lead</Label>
                <select
                  id="lead"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">No lead</option>
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
