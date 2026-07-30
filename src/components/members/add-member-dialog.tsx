"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface Role {
  id: string
  name: string
}

interface AddMemberDialogProps {
  organizationId: string
  roles: Role[]
}

const USER_TYPES = [
  { value: "member", label: "Member" },
  { value: "contractor", label: "Contractor" },
  { value: "intern", label: "Intern" },
  { value: "external", label: "External" },
]

export function AddMemberDialog({ organizationId, roles }: AddMemberDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      organizationId,
      roleId: form.get("roleId") as string,
      userType: form.get("userType") as string,
    }

    if (!data.email || !data.roleId) {
      setError("Email and role are required")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to add member")
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Member</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader onClose={() => setOpen(false)}>
          Add Member
        </DialogHeader>
        <DialogContent>
          <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Jane Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@acme.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Leave blank for passwordless"
              />
              <p className="text-xs text-muted-foreground">
                Set a password for local account creation. Leave blank to create
                a passwordless account.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleId">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                name="roleId"
                required
                placeholder="Select a role"
                options={roles.map((r) => ({ value: r.id, label: r.name }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select
                name="userType"
                defaultValue="member"
                options={USER_TYPES}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="add-member-form" disabled={loading}>
            {loading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
