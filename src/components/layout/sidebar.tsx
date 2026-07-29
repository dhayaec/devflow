import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { OrgSwitcher } from "@/components/org/org-switcher"

interface SidebarProps {
  orgSlug: string
}

export async function Sidebar({ orgSlug }: SidebarProps) {
  const session = await auth()
  if (!session?.user?.id) return null

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
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
    <aside className="hidden md:flex w-60 flex-col border-r bg-muted/30">
      <div className="p-3 border-b">
        <OrgSwitcher organizations={orgs} />
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <span className="w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
          <div className="size-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {session.user.name?.[0] ?? session.user.email?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{session.user.name ?? "User"}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
