export interface Issue {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  type: string
  projectId: string
  sprintId: string | null
  reporterId: string
  assigneeId: string | null
  dueDate: string | null
  estimate: number | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  assignee?: { id: string; name: string | null; image: string | null } | null
  reporter?: { id: string; name: string | null; image: string | null }
  sprint?: { id: string; title: string } | null
  labels?: { label: { id: string; name: string; color: string } }[]
  _count?: { comments: number; attachments: number; checklists: number }
}
