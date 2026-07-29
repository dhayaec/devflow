"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  if (!session?.user) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {session.user.name?.[0] ?? session.user.email?.[0]}
        </div>
        <span className="hidden sm:inline text-sm">{session.user.name}</span>
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-md z-20">
            <div className="px-2 py-1.5 text-sm text-muted-foreground border-b mb-1">
              {session.user.email}
            </div>
            <button
              onClick={() => signOut()}
              className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
