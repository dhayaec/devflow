"use client"

import { useSidebarStore } from "@/stores/sidebar-store"

export function SidebarToggleClient({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebarStore((s) => s.collapsed)

  return (
    <div
      className={`overflow-hidden transition-[width] duration-200 ${
        collapsed ? "w-0" : "w-60"
      }`}
    >
      {children}
    </div>
  )
}
