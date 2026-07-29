import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { priorities } from "./issue-priority"

interface IssueCardProps {
  issue: {
    id: string
    title: string
    status: string
    priority: string
    type: string
    assignee: { id: string; name: string | null; image: string | null } | null
    labels?: { label: { id: string; name: string; color: string } }[]
    _count?: { comments: number; attachments: number }
  }
  projectSlug: string
  orgSlug: string
}

const statusColors: Record<string, "outline" | "success" | "warning" | "danger" | "secondary" | "default"> = {
  backlog: "outline",
  todo: "default",
  in_progress: "warning",
  review: "secondary",
  done: "success",
  cancelled: "danger",
}

const typeIcons: Record<string, string> = {
  task: "T",
  bug: "B",
  feature: "F",
  improvement: "I",
  epic: "E",
}

export function IssueCard({
  issue,
  projectSlug,
  orgSlug,
}: IssueCardProps) {
  const priorityIcon = priorities.find((p) => p.value === issue.priority)

  return (
    <Link
      href={`/${orgSlug}/projects/${projectSlug}/issues/${issue.id}`}
      className="block rounded-lg border p-3 hover:border-ring/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-xs font-mono text-muted-foreground shrink-0">
          {typeIcons[issue.type] ?? "T"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug line-clamp-2">
            {issue.title}
          </p>
          {issue.labels && issue.labels.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {issue.labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${label.color}20`,
                    color: label.color,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={statusColors[issue.status] ?? "outline"}
              className="text-[10px] px-1.5 py-0"
            >
              {issue.status.replace("_", " ")}
            </Badge>
            {priorityIcon && (
              <priorityIcon.icon className={`size-3 ${priorityIcon.color}`} />
            )}
            {issue.assignee && (
              <Avatar
                src={issue.assignee.image}
                fallback={issue.assignee.name?.[0] ?? "?"}
                size="sm"
                className="ml-auto"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
