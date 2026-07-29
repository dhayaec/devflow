import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sprintId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { sprintId } = await params

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!sprint) {
    return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: sprint.project.organizationId,
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

  const body = await request.json()
  const { title, goal, status, startDate, endDate } = body

  const data: Record<string, unknown> = {}
  if (title !== undefined) data.title = title
  if (goal !== undefined) data.goal = goal
  if (status !== undefined) data.status = status
  if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null
  if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null

  const updated = await db.sprint.update({
    where: { id: sprintId },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sprintId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { sprintId } = await params

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!sprint) {
    return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: sprint.project.organizationId,
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
    (rp) => rp.permission.action === "project.delete",
  )
  if (!canDelete) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    )
  }

  await db.sprint.delete({ where: { id: sprintId } })

  return NextResponse.json({ success: true })
}
