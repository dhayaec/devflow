import { auth } from "@/auth"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { SidebarToggle } from "@/components/layout/sidebar-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { CommandPaletteWrapper } from "@/features/search/components/command-palette-wrapper"

export async function Navbar() {
  const session = await auth()

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <SidebarToggle className="hidden md:inline-flex" />
        <span className="font-semibold text-lg">DevFlow</span>
      </div>
      <div className="flex items-center gap-2">
        {session?.user?.id && <CommandPaletteWrapper />}
        {session?.user?.id && <NotificationBell userId={session.user.id} />}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
