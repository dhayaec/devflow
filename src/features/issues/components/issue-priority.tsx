"use client"

import { ChevronUp, ArrowUp, Minus, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select } from "@/components/ui/select"

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
      <Select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        options={priorities.map((p) => ({
          value: p.value,
          label: p.label,
        }))}
      />
    </div>
  )
}

export { priorities }
export type { Priority }
