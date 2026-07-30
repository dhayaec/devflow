"use client"

import { signOut } from "next-auth/react"

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
          {user.name?.[0] ?? user.email?.[0]}
        </div>
        <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
      </div>
      <button
        onClick={() => signOut()}
        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
