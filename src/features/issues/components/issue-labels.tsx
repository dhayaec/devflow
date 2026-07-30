"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Label {
  id: string
  name: string
  color: string
}

interface IssueLabelsProps {
  labels: { label: Label }[]
  allLabels: Label[]
  onToggleLabel: (labelId: string) => void
  readonly?: boolean
}

export function IssueLabels({
  labels,
  allLabels,
  onToggleLabel,
  readonly,
}: IssueLabelsProps) {
  const [open, setOpen] = useState(false)
  const selectedIds = new Set(labels.map((l) => l.label.id))

  if (readonly) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {labels.length === 0 && (
          <span className="text-sm text-muted-foreground">None</span>
        )}
        {labels.map(({ label }) => (
          <span
            key={label.id}
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${label.color}20`, color: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground">Labels</label>
      <div className="flex flex-wrap gap-1.5">
        {labels.map(({ label }) => (
          <span
            key={label.id}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${label.color}20`, color: label.color }}
          >
            {label.name}
            <button
              onClick={() => onToggleLabel(label.id)}
              className="cursor-pointer hover:opacity-70"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setOpen(!open)}
        >
          <Plus className="size-3" />
        </Button>
      </div>

      {open && (
        <div className="rounded-lg border p-2 space-y-1">
          {allLabels
            .filter((l) => !selectedIds.has(l.id))
            .map((label) => (
              <button
                key={label.id}
                onClick={() => {
                  onToggleLabel(label.id)
                  setOpen(false)
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </button>
            ))}
          {allLabels.every((l) => selectedIds.has(l.id)) && (
            <p className="px-2 py-1 text-xs text-muted-foreground">
              All labels added
            </p>
          )}
        </div>
      )}
    </div>
  )
}
