import { auth } from "@/auth"
import { db } from "@/lib/db"
import { OrgSwitcher } from "@/components/org/org-switcher"
import { SidebarNav } from "./sidebar-nav"
import { SidebarToggleClient } from "./sidebar-toggle-client"

interface SidebarProps {
  orgSlug: string
}

export async function Sidebar({ orgSlug }: SidebarProps) {
  const session = await auth()
  if (!session?.user?.id) return null

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  const orgs = memberships.map((m) => m.organization)

  const navItems = [
    { label: "Dashboard", href: `/${orgSlug}`, icon: "◉" },
    { label: "Projects", href: `/${orgSlug}/projects`, icon: "□" },
    { label: "Chat", href: `/${orgSlug}/chat`, icon: "💬" },
    { label: "Members", href: `/${orgSlug}/members`, icon: "👥" },
    { label: "Teams", href: `/${orgSlug}/teams`, icon: "⚡" },
    { label: "Settings", href: `/${orgSlug}/settings`, icon: "⚙" },
  ]

  return (
    <SidebarToggleClient>
      <aside className="hidden md:flex w-60 flex-col border-r bg-muted/30 transition-[width] duration-200">
        <div className="p-3 border-b flex items-center gap-2">
          <OrgSwitcher organizations={orgs} />
        </div>

        <SidebarNav items={navItems} />

        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            <div className="size-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
              {session.user.name?.[0] ?? session.user.email?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{session.user.name ?? "User"}</p>
            </div>
          </div>
        </div>
      </aside>
    </SidebarToggleClient>
  )
}
