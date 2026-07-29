"use client"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Table2,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DocumentToolbarProps {
  editor: Editor | null
}

export function DocumentToolbar({ editor }: DocumentToolbarProps) {
  if (!editor) return null

  const addLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  const ToolButton = ({
    active,
    onClick,
    children,
    title,
  }: {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-3 py-1.5">
      <ToolButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="size-3.5" />
      </ToolButton>

      <div className="mx-1 w-px h-5 bg-border" />

      <ToolButton
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="size-3.5" />
      </ToolButton>

      <div className="mx-1 w-px h-5 bg-border" />

      <ToolButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-3.5" />
      </ToolButton>

      <div className="mx-1 w-px h-5 bg-border" />

      <ToolButton
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Ordered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Task List"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <ListChecks className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="size-3.5" />
      </ToolButton>

      <div className="mx-1 w-px h-5 bg-border" />

      <ToolButton
        title="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-3.5" />
      </ToolButton>
      <ToolButton
        title="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="size-3.5" />
      </ToolButton>

      <div className="mx-1 w-px h-5 bg-border" />

      <ToolButton title="Link" onClick={addLink}>
        <LinkIcon className="size-3.5" />
      </ToolButton>
      <ToolButton title="Image" onClick={addImage}>
        <ImageIcon className="size-3.5" />
      </ToolButton>
      <ToolButton title="Table" onClick={addTable}>
        <Table2 className="size-3.5" />
      </ToolButton>
    </div>
  )
}
