"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Globe, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Editor } from "@/features/documents/components/editor"

interface WikiEditorProps {
  doc: {
    id: string
    title: string
    content: string
    isPublished: boolean
    parentId: string | null
  }
  parent?: { id: string; title: string }
  orgSlug: string
  projectSlug: string
}

export function WikiEditor({
  doc,
  parent,
  orgSlug,
  projectSlug,
}: WikiEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(doc.title)
  const [saving, setSaving] = useState(false)

  const saveContent = useCallback(
    async (html: string) => {
      setSaving(true)
      try {
        await fetch(`/api/documents/${doc.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: html }),
        })
      } finally {
        setSaving(false)
      }
    },
    [doc.id],
  )

  const saveTitle = async () => {
    if (title === doc.title) return
    await fetch(`/api/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    router.refresh()
  }

  const togglePublish = async () => {
    await fetch(`/api/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !doc.isPublished }),
    })
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-2.5">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link
            href={`/${orgSlug}/projects/${projectSlug}/wiki`}
            className="hover:text-foreground"
          >
            Wiki
          </Link>
          {parent && (
            <>
              <span>/</span>
              <Link
                href={`/${orgSlug}/projects/${projectSlug}/wiki/${parent.id}`}
                className="hover:text-foreground"
              >
                {parent.title}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {saving ? "Saving..." : "Saved"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePublish}
            type="button"
          >
            {doc.isPublished ? (
              <>
                <Globe className="size-3.5" />
                Published
              </>
            ) : (
              <>
                <Lock className="size-3.5" />
                Draft
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pt-4 pb-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="border-0 bg-transparent px-0 text-2xl font-bold focus-visible:ring-0 h-auto"
          placeholder="Untitled"
        />
      </div>

      {/* Editor */}
      <div className="flex-1 px-0 pb-6">
        <Editor
          content={doc.content}
          onSave={saveContent}
          placeholder="Start writing..."
          documentId={doc.id}
          className="border-0 rounded-none mx-6"
        />
      </div>
    </div>
  )
}
