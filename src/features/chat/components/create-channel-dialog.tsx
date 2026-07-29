"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateChannelDialogProps {
  organizationId: string
  orgSlug: string
}

export function CreateChannelDialog({
  organizationId,
  orgSlug,
}: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [topic, setTopic] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          topic: topic || undefined,
          organizationId,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to create channel")
        return
      }

      const channel = await res.json()
      setOpen(false)
      setName("")
      setTopic("")
      router.push(`/${orgSlug}/chat/${channel.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="px-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-xs"
        >
          <Plus className="size-3.5" />
          Create channel
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader onClose={() => setOpen(false)}>
            Create Channel
          </DialogHeader>

          <DialogContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Channel name</Label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="general"
                  required
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What's this channel about?"
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Channel"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
