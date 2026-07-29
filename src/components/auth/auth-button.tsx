"use client"

import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import Link from "next/link"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button variant="ghost" size="sm" disabled>Loading...</Button>
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{session.user.email}</span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="default" size="sm" render={<Link href="/login" />}>
      Sign In
    </Button>
  )
}
