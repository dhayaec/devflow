import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const sprintId = searchParams.get("sprintId")
  const status = searchParams.get("status")
  const assigneeId = searchParams.get("assigneeId")

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId query parameter is required" },
      { status: 400 },
    )
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const where: Record<string, unknown> = { projectId }
  if (sprintId) where.sprintId = sprintId
  if (status) where.status = status
  if (assigneeId) where.assigneeId = assigneeId

  const issues = await db.issue.findMany({
    where,
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      reporter: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true } },
      labels: { include: { label: true } },
      _count: { select: { comments: true, attachments: true, checklists: true } },
    },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(issues)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, type, priority, status, projectId, sprintId, assigneeId, parentId, dueDate, estimate } = body

  if (!title || !projectId) {
    return NextResponse.json(
      { error: "title and projectId are required" },
      { status: 400 },
    )
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: project.organizationId,
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

  const canCreate = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "issue.create",
  )
  if (!canCreate) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  const maxSort = await db.issue.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  })

  const issue = await db.issue.create({
    data: {
      title,
      description,
      type: type ?? "task",
      priority: priority ?? "medium",
      status: status ?? "backlog",
      projectId,
      sprintId: sprintId ?? null,
      reporterId: session.user.id,
      assigneeId: assigneeId ?? null,
      parentId: parentId ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
      estimate: estimate ?? null,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1000,
    },
    include: {
      assignee: { select: { id: true, name: true, image: true } },
      reporter: { select: { id: true, name: true, image: true } },
      sprint: { select: { id: true, title: true } },
      labels: { include: { label: true } },
      _count: { select: { comments: true, attachments: true, checklists: true } },
    },
  })

  return NextResponse.json(issue, { status: 201 })
}
