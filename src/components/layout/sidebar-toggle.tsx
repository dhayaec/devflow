"use client"

import { PanelLeftClose, PanelLeft } from "lucide-react"
import { useSidebarStore } from "@/stores/sidebar-store"
import { Button } from "@/components/ui/button"

export function SidebarToggle({ className }: { className?: string }) {
  const collapsed = useSidebarStore((s) => s.collapsed)
  const toggle = useSidebarStore((s) => s.toggle)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={className}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
    </Button>
  )
}
