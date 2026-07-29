"use client"

import { useEffect } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"

interface OnlineUser {
  userId: string
  name: string
  image: string | null
}

interface PresenceAvatarsProps {
  userId: string
  orgSlug: string
  orgId: string
}

export function PresenceAvatars({ userId, orgSlug, orgId }: PresenceAvatarsProps) {
  const { onlineUsers, presence, setOnlineUsers } = useCollaboration(userId)

  useEffect(() => {
    presence.joinOrg(orgId)
    const unsub = presence.onPresenceChange(setOnlineUsers)
    return () => {
      unsub?.()
      presence.leaveOrg(orgId)
    }
  }, [orgId, presence, setOnlineUsers])

  const others = onlineUsers.filter((u) => u.userId !== userId)

  return (
    <div className="flex items-center gap-1">
      {others.length === 0 && (
        <span className="text-xs text-muted-foreground">No other members online</span>
      )}
      {others.length > 0 && (
        <div className="flex -space-x-2">
          {others.slice(0, 5).map((user) => (
            <div
              key={user.userId}
              className="relative size-7 rounded-full border-2 border-background bg-muted"
              title={user.name}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-1 ring-background" />
            </div>
          ))}
        </div>
      )}
      {others.length > 5 && (
        <span className="text-xs text-muted-foreground">+{others.length - 5}</span>
      )}
    </div>
  )
}
