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

  const sprints = await db.sprint.findMany({
    where: { projectId },
    include: {
      _count: { select: { issues: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(sprints)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { title, goal, projectId, startDate, endDate } = body

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

  const canEdit = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "project.edit",
  )
  if (!canEdit) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    )
  }

  const sprint = await db.sprint.create({
    data: {
      title,
      goal,
      projectId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  })

  return NextResponse.json(sprint, { status: 201 })
}
