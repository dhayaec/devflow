"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: string
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-2 space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
