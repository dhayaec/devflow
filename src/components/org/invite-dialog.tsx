"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InviteDialogProps {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteDialog({ organizationId, open, onOpenChange }: InviteDialogProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSuccess(false)

    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, organizationId }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Failed to send invitation")
      setLoading(false)
      return
    }

    setSuccess(true)
    setEmail("")
    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Invite Member</h2>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600">Invitation sent successfully!</p>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setSuccess(false)
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
