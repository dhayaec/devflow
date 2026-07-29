import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { projectId } = await params

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      lead: { select: { id: true, name: true, image: true } },
      organization: { select: { id: true, slug: true, name: true } },
      sprints: { orderBy: { createdAt: "desc" } },
      _count: {
        select: {
          issues: true,
          sprints: true,
          labels: true,
          documents: true,
        },
      },
    },
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

  return NextResponse.json(project)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { projectId } = await params

  const existing = await db.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: existing.organizationId,
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
  const { name, slug, description, icon, leadId, startDate, endDate, isArchived } = body

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name
  if (slug !== undefined) data.slug = slug
  if (description !== undefined) data.description = description
  if (icon !== undefined) data.icon = icon
  if (leadId !== undefined) data.leadId = leadId
  if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null
  if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null
  if (isArchived !== undefined) data.isArchived = isArchived

  const project = await db.project.update({
    where: { id: projectId },
    data,
    include: {
      lead: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(project)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { projectId } = await params

  const existing = await db.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: existing.organizationId,
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

  await db.project.delete({ where: { id: projectId } })

  return NextResponse.json({ success: true })
}
