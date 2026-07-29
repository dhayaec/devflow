"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface ProjectSettingsFormProps {
  project: {
    id: string
    name: string
    slug: string
    description: string
    leadId: string
    startDate: string
    endDate: string
    isArchived: boolean
  }
  orgSlug: string
  members: { id: string; name: string | null }[]
}

export function ProjectSettingsForm({
  project,
  orgSlug,
  members,
}: ProjectSettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(project.name)
  const [slug, setSlug] = useState(project.slug)
  const [description, setDescription] = useState(project.description)
  const [leadId, setLeadId] = useState(project.leadId)
  const [startDate, setStartDate] = useState(project.startDate)
  const [endDate, setEndDate] = useState(project.endDate)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          leadId: leadId || null,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: "error", text: data.error ?? "Failed to update" })
        return
      }

      setMessage({ type: "success", text: "Settings saved" })
      router.refresh()
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this project?")) return
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      })

      if (!res.ok) throw new Error()
      router.push(`/${orgSlug}/projects`)
      router.refresh()
    } catch {
      setMessage({ type: "error", text: "Failed to archive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) return
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()
      router.push(`/${orgSlug}/projects`)
      router.refresh()
    } catch {
      setMessage({ type: "error", text: "Failed to delete" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-emerald-500/10 text-emerald-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lead">Project Lead</Label>
          <Select
            id="lead"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            options={members.map((m) => ({
              value: m.id,
              label: m.name ?? "Unknown",
            }))}
            placeholder="No lead"
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
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleArchive}
            disabled={loading}
          >
            Archive
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
