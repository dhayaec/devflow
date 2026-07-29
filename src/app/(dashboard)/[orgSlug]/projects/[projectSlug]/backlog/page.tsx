import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

const priorityColors = {
  urgent: "danger" as const,
  high: "warning" as const,
  medium: "default" as const,
  low: "secondary" as const,
}

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  cancelled: "Cancelled",
}

export default async function BacklogPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, projectSlug } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const project = await db.project.findUnique({
    where: {
      organizationId_slug: { slug: projectSlug, organizationId: org.id },
    },
  })
  if (!project) notFound()

  const issues = await db.issue.findMany({
    where: { projectId: project.id },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  })

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Backlog</h1>
        <p className="text-sm text-muted-foreground">
          {issues.length} issue{issues.length !== 1 ? "s" : ""}
        </p>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No issues in the backlog</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Title</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Priority</th>
                <th className="px-4 py-2 text-left font-medium">Sprint</th>
                <th className="px-4 py-2 text-left font-medium">Assignee</th>
                <th className="px-4 py-2 text-left font-medium">Comments</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/${orgSlug}/projects/${projectSlug}/issues/${issue.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {issue.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="outline">
                      {statusLabels[issue.status] ?? issue.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant={
                        priorityColors[issue.priority as keyof typeof priorityColors] ?? "secondary"
                      }
                    >
                      {issue.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {issue.sprint?.title ?? "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={issue.assignee.image}
                          fallback={issue.assignee.name?.[0] ?? "?"}
                          size="sm"
                        />
                        <span className="text-muted-foreground">
                          {issue.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {issue._count.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
