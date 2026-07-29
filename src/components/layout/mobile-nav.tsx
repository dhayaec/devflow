"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function MobileNav() {
  const params = useParams()
  const pathname = usePathname()
  const orgSlug = params?.orgSlug as string

  if (!orgSlug) return null

  const items = [
    { label: "Home", href: `/${orgSlug}`, icon: "◉" },
    { label: "Projects", href: `/${orgSlug}/projects`, icon: "□" },
    { label: "Chat", href: `/${orgSlug}/chat`, icon: "💬" },
    { label: "Members", href: `/${orgSlug}/members`, icon: "👥" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
