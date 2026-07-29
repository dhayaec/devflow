"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocNode {
  id: string
  title: string
  children?: DocNode[]
}

interface DocumentTreeProps {
  documents: DocNode[]
  orgSlug: string
  projectSlug: string
  currentDocId?: string
  projectId: string
}

export function DocumentTree({
  documents,
  orgSlug,
  projectSlug,
  currentDocId,
  projectId,
}: DocumentTreeProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const createDoc = async (parentId?: string) => {
    const title = prompt("Document title:")
    if (!title) return

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, projectId, parentId }),
    })

    if (res.ok) {
      const doc = await res.json()
      router.push(
        `/${orgSlug}/projects/${projectSlug}/wiki/${doc.id}`,
      )
      router.refresh()
    }
  }

  const deleteDoc = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!confirm("Delete this document?")) return

    await fetch(`/api/documents/${docId}`, { method: "DELETE" })
    router.refresh()
  }

  const renderNode = (doc: DocNode, depth = 0) => {
    const isCollapsed = collapsed.has(doc.id)
    const isActive = doc.id === currentDocId
    const hasChildren = doc.children && doc.children.length > 0

    return (
      <div key={doc.id}>
        <div className="group relative">
          <Link
            href={`/${orgSlug}/projects/${projectSlug}/wiki/${doc.id}`}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
              isActive && "bg-accent text-accent-foreground font-medium",
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleCollapse(doc.id)
                }}
                className="shrink-0 text-muted-foreground"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            ) : (
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{doc.title}</span>
          </Link>

          <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                createDoc(doc.id)
              }}
              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-accent"
              title="Add sub-page"
            >
              <Plus className="size-3" />
            </button>
            <button
              type="button"
              onClick={(e) => deleteDoc(doc.id, e)}
              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div>
            {doc.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pages
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => createDoc()}
          title="New page"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="px-2 py-4 text-center text-xs text-muted-foreground">
          No pages yet
        </p>
      ) : (
        documents.map((doc) => renderNode(doc))
      )}
    </div>
  )
}
