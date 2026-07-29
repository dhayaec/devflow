"use client"

import { useState } from "react"
import { Bell, BellOff } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface WatcherUser {
  id: string
  name: string | null
  image: string | null
}

interface IssueWatchersProps {
  watchers: { user: WatcherUser }[]
  issueId: string
  currentUserId: string
}

export function IssueWatchers({
  watchers,
  issueId,
  currentUserId,
}: IssueWatchersProps) {
  const [watching, setWatching] = useState(
    watchers.some((w) => w.user.id === currentUserId),
  )

  const toggleWatch = async () => {
    const method = watching ? "DELETE" : "POST"
    const res = await fetch(`/api/issues/${issueId}/watchers`, { method })
    if (res.ok) setWatching(!watching)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground">Watchers</label>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={toggleWatch}
        >
          {watching ? (
            <BellOff className="size-3.5" />
          ) : (
            <Bell className="size-3.5" />
          )}
        </Button>
      </div>

      {watchers.length === 0 ? (
        <span className="text-sm text-muted-foreground">No watchers</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {watchers.map((w) => (
            <div key={w.user.id} className="flex items-center gap-1.5">
              <Avatar
                src={w.user.image}
                fallback={w.user.name?.[0] ?? "?"}
                size="sm"
              />
              <span className="text-sm text-muted-foreground">
                {w.user.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
