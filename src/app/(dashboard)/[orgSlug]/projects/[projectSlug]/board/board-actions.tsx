"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IssueForm } from "@/features/issues/components/issue-form"

interface BoardActionsProps {
  projectId: string
  orgSlug: string
  projectSlug: string
  members: { id: string; name: string | null }[]
  sprints: { id: string; title: string }[]
}

export function BoardActions({
  projectId,
  orgSlug,
  projectSlug,
  members,
  sprints,
}: BoardActionsProps) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setFormOpen(true)}>
        <Plus className="size-4" />
        Add Issue
      </Button>
      <IssueForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        projectId={projectId}
        orgSlug={orgSlug}
        projectSlug={projectSlug}
        members={members}
        sprints={sprints}
      />
    </>
  )
}
