"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChecklistItem {
  id: string
  title: string
  isChecked: boolean
  sortOrder: number
}

interface IssueChecklistProps {
  items: ChecklistItem[]
  issueId: string
  readonly?: boolean
}

export function IssueChecklist({ items, issueId, readonly }: IssueChecklistProps) {
  const [checklist, setChecklist] = useState(items)
  const [newTitle, setNewTitle] = useState("")
  const [adding, setAdding] = useState(false)

  const toggleItem = async (itemId: string, checked: boolean) => {
    setChecklist((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isChecked: checked } : i)),
    )
    try {
      const res = await fetch(`/api/issues/${issueId}/checklist/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isChecked: checked }),
      })
      if (!res.ok) {
        // Revert optimistic update on failure
        setChecklist((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, isChecked: !checked } : i,
          ),
        )
      }
    } catch {
      setChecklist((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, isChecked: !checked } : i,
        ),
      )
    }
  }

  const addItem = async () => {
    if (!newTitle.trim()) return
    const res = await fetch(`/api/issues/${issueId}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    })
    if (res.ok) {
      const item = await res.json()
      setChecklist((prev) => [...prev, item])
      setNewTitle("")
      setAdding(false)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/checklist/${itemId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setChecklist((prev) => prev.filter((i) => i.id !== itemId))
      }
    } catch {
      // silently ignore
    }
  }

  const checked = checklist.filter((i) => i.isChecked).length
  const total = checklist.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Checklist ({checked}/{total})
        </h4>
      </div>

      {total > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${total > 0 ? (checked / total) * 100 : 0}%` }}
          />
        </div>
      )}

      <div className="space-y-1">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={(e) => toggleItem(item.id, e.target.checked)}
              className="size-4 rounded border-border accent-primary"
              disabled={readonly}
            />
            <span
              className={`flex-1 text-sm ${
                item.isChecked ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.title}
            </span>
            {!readonly && (
              <button
                onClick={() => deleteItem(item.id)}
                className="cursor-pointer opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readonly && (
        <div>
          {adding ? (
            <div className="flex items-center gap-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Checklist item..."
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                className="h-7 text-sm"
              />
              <Button size="xs" onClick={addItem} type="button">
                Add
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setAdding(false)}
                type="button"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAdding(true)}
              type="button"
            >
              <Plus className="size-3.5" />
              Add item
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
