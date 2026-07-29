import { auth } from "@/auth"
import { db } from "@/lib/db"
import { UserMenu } from "@/components/layout/user-menu"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { CommandPaletteWrapper } from "@/features/search/components/command-palette-wrapper"

export async function Navbar() {
  const session = await auth()
  let orgId: string | undefined

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg">DevFlow</span>
      </div>
      <div className="flex items-center gap-2">
        {session?.user?.id && <CommandPaletteWrapper userId={session.user.id} />}
        {session?.user?.id && <NotificationBell userId={session.user.id} />}
        <UserMenu />
      </div>
    </header>
  )
}
