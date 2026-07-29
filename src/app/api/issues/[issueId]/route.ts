import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      reporter: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true, status: true } },
      project: {
        select: { id: true, slug: true, organizationId: true, name: true },
      },
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
          attachments: true,
        },
        orderBy: { createdAt: "asc" },
        where: { parentId: null },
      },
    },
  })

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: issue.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  return NextResponse.json(issue)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: issue.project.organizationId,
      },
    },
    include: {
      role: {
        include: {
          rolePermissions: { include: { permission: true } },
        },
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const canEdit = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "issue.edit",
  )
  if (!canEdit) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const body = await request.json()
  const allowed = [
    "title", "description", "status", "priority", "type",
    "sprintId", "assigneeId", "parentId", "dueDate", "estimate",
    "sortOrder", "isArchived",
  ]

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "dueDate") {
        data[key] = body[key] ? new Date(body[key]) : null
      } else {
        data[key] = body[key]
      }
    }
  }

  const updated = await db.issue.update({
    where: { id: issueId },
    data,
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      reporter: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true } },
      labels: { include: { label: true } },
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { issueId } = await params

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: issue.project.organizationId,
      },
    },
    include: {
      role: {
        include: {
          rolePermissions: { include: { permission: true } },
        },
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const canDelete = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "issue.delete",
  )
  if (!canDelete) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  await db.issue.delete({ where: { id: issueId } })
  return NextResponse.json({ success: true })
}
