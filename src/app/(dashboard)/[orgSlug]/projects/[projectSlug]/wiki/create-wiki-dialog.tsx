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

interface CreateWikiDialogProps {
  projectId: string
  orgSlug: string
  projectSlug: string
}

export function CreateWikiDialog({
  projectId,
  orgSlug,
  projectSlug,
}: CreateWikiDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, projectId }),
      })

      if (res.ok) {
        const doc = await res.json()
        setOpen(false)
        setTitle("")
        router.push(
          `/${orgSlug}/projects/${projectSlug}/wiki/${doc.id}`,
        )
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Page
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader onClose={() => setOpen(false)}>
            Create Wiki Page
          </DialogHeader>
          <DialogContent>
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                required
                autoFocus
              />
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
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
