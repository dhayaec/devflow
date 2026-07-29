"use client"

import { ChevronUp, ArrowUp, Minus, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

const priorities = [
  { value: "urgent", label: "Urgent", icon: ChevronUp, color: "text-red-500" },
  { value: "high", label: "High", icon: ArrowUp, color: "text-amber-500" },
  { value: "medium", label: "Medium", icon: Minus, color: "text-blue-500" },
  { value: "low", label: "Low", icon: ArrowDown, color: "text-gray-400" },
] as const

type Priority = (typeof priorities)[number]["value"]

interface IssuePriorityProps {
  value: string
  onChange?: (value: string) => void
  readonly?: boolean
}

export function IssuePriority({
  value,
  onChange,
  readonly,
}: IssuePriorityProps) {
  const current = priorities.find((p) => p.value === value) ?? priorities[2]
  const Icon = current.icon

  if (readonly) {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <Icon className={cn("size-4", current.color)} />
        <span>{current.label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">Priority</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {priorities.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export { priorities }
export type { Priority }
