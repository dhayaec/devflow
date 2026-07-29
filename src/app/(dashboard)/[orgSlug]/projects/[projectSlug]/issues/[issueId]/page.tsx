import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { IssueComments } from "@/features/issues/components/issue-comments"
import { IssueChecklist } from "@/features/issues/components/issue-checklist"
import { IssueSidebar } from "@/features/issues/components/issue-sidebar"
import { IssueDetailActions } from "./issue-detail-actions"
import { IssueRealtimeWrapper } from "@/features/issues/components/issue-realtime-wrapper"

const statusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  cancelled: "Cancelled",
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; issueId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, projectSlug, issueId } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const project = await db.project.findUnique({
    where: {
      organizationId_slug: { organizationId: org.id, slug: projectSlug },
    },
  })
  if (!project) notFound()

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      reporter: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true, status: true } },
      labels: {
        include: { label: true },
        orderBy: { label: { name: "asc" } },
      },
      checklists: { orderBy: { sortOrder: "asc" } },
      watchers: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      attachments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
        where: { parentId: null },
      },
    },
  })

  if (!issue || issue.projectId !== project.id) notFound()

  const allLabels = await db.label.findMany({
    where: { projectId: project.id },
    orderBy: { name: "asc" },
  })

  const members = await db.membership.findMany({
    where: { organizationId: org.id },
    include: { user: { select: { id: true, name: true } } },
  })

  const sprints = await db.sprint.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  })

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/${orgSlug}/projects`}
          className="hover:text-foreground"
        >
          Projects
        </Link>
        <span>/</span>
        <Link
          href={`/${orgSlug}/projects/${projectSlug}`}
          className="hover:text-foreground"
        >
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {issue.title}
        </span>
      </div>

      <IssueRealtimeWrapper issueId={issue.id} projectId={project.id} userId={session.user.id}>
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Title & actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {issue.type}
                </Badge>
                <Badge variant="outline">{statusLabels[issue.status] ?? issue.status}</Badge>
              </div>
              <h1 className="text-xl font-bold">{issue.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  Created {formatDate(issue.createdAt)} by{" "}
                  {issue.reporter.name ?? "Unknown"}
                </span>
                {issue.updatedAt > issue.createdAt && (
                  <span>Updated {formatDate(issue.updatedAt)}</span>
                )}
              </div>
            </div>
            <IssueDetailActions
              issueId={issue.id}
              orgSlug={orgSlug}
              projectSlug={projectSlug}
            />
          </div>

          {/* Description */}
          {issue.description && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 text-sm font-medium">Description</h3>
              <p className="text-sm whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>
          )}

          {/* Checklist */}
          {issue.checklists.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <IssueChecklist
                items={JSON.parse(JSON.stringify(issue.checklists))}
                issueId={issue.id}
              />
            </div>
          )}

          {/* Comments */}
          <div className="rounded-lg border p-4">
            <IssueComments
              comments={JSON.parse(JSON.stringify(issue.comments))}
              issueId={issue.id}
              currentUserId={session.user.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <IssueSidebar
          issueId={issue.id}
          projectId={project.id}
          assignee={issue.assignee ? { id: issue.assignee.id, name: issue.assignee.name, image: issue.assignee.image } : null}
          sprint={issue.sprint ? { id: issue.sprint.id, title: issue.sprint.title, status: issue.sprint.status } : null}
          priority={issue.priority}
          status={issue.status}
          dueDate={issue.dueDate?.toISOString() ?? null}
          labels={JSON.parse(JSON.stringify(issue.labels))}
          watchers={JSON.parse(JSON.stringify(issue.watchers))}
          allLabels={JSON.parse(JSON.stringify(allLabels))}
          members={members.map((m) => ({
            id: m.userId,
            name: m.user.name,
          }))}
          sprints={sprints.map((s) => ({
            id: s.id,
            title: s.title,
            status: s.status,
          }))}
          currentUserId={session.user.id}
        />
      </div>
      </IssueRealtimeWrapper>
    </div>
  )
}
