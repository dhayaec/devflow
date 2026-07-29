import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import type { Extensions } from "@tiptap/react"

const lowlight = createLowlight(common)

export function getExtensions(placeholder?: string): Extensions {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: { levels: [1, 2, 3, 4] },
    }),
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({
      placeholder: placeholder ?? "Start writing...",
    }),
    Link.configure({
      openOnClick: true,
      HTMLAttributes: { class: "text-primary underline underline-offset-2" },
    }),
    Image.configure({
      HTMLAttributes: { class: "max-w-full rounded-lg" },
    }),
    TaskList.configure({
      HTMLAttributes: { class: "not-prose pl-0 space-y-1" },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: { class: "flex items-start gap-2" },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: "border-collapse w-full" },
    }),
    TableRow.configure({
      HTMLAttributes: { class: "border-b" },
    }),
    TableCell.configure({
      HTMLAttributes: { class: "border px-3 py-2 text-sm" },
    }),
    TableHeader.configure({
      HTMLAttributes: { class: "border px-3 py-2 text-sm font-medium bg-muted/50" },
    }),
    CodeBlockLowlight.configure({ lowlight }),
  ]
}
