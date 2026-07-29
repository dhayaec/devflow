"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IssueDetailActionsProps {
  issueId: string
  orgSlug: string
  projectSlug: string
}

export function IssueDetailActions({
  issueId,
  orgSlug,
  projectSlug,
}: IssueDetailActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Delete this issue? This cannot be undone.")) return

    const res = await fetch(`/api/issues/${issueId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      router.push(`/${orgSlug}/projects/${projectSlug}/board`)
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        title="Delete issue"
      >
        <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  )
}
