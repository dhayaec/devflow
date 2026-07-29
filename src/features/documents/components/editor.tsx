"use client"

import { useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import { getExtensions } from "./editor-extensions"
import { DocumentToolbar } from "./document-toolbar"
import { useAutosave } from "@/hooks/use-autosave"
import { cn } from "@/lib/utils"

interface EditorProps {
  content: string
  onSave: (html: string) => Promise<void>
  placeholder?: string
  className?: string
  documentId?: string
}

export function Editor({
  content,
  onSave,
  placeholder,
  className,
  documentId,
}: EditorProps) {
  const editor = useEditor({
    extensions: getExtensions(placeholder),
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-4",
      },
    },
  })

  const save = useCallback(async () => {
    if (editor && editor.getHTML() !== content) {
      await onSave(editor.getHTML())
    }
  }, [editor, content, onSave])

  useAutosave(save, 3000, documentId)

  return (
    <div
      className={cn(
        "rounded-lg border bg-background",
        className,
      )}
    >
      <DocumentToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
