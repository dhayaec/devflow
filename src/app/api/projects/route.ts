import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get("orgId")

  if (!orgId) {
    return NextResponse.json(
      { error: "orgId query parameter is required" },
      { status: 400 },
    )
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId: orgId },
    },
  })

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId, isArchived: false },
    include: {
      lead: { select: { id: true, name: true, image: true } },
      _count: { select: { issues: true, sprints: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, slug, description, icon, organizationId, leadId, startDate, endDate } = body

  if (!name || !slug || !organizationId) {
    return NextResponse.json(
      { error: "name, slug, and organizationId are required" },
      { status: 400 },
    )
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  })

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const hasProjectCreate = membership.role.rolePermissions.some(
    (rp) => rp.permission.action === "project.create",
  )
  if (!hasProjectCreate) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    )
  }

  const existing = await db.project.findUnique({
    where: { organizationId_slug: { slug, organizationId } },
  })
  if (existing) {
    return NextResponse.json(
      { error: "A project with this slug already exists" },
      { status: 409 },
    )
  }

  const project = await db.project.create({
    data: {
      name,
      slug,
      description,
      icon,
      organizationId,
      leadId: leadId ?? null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
    include: {
      lead: { select: { id: true, name: true, image: true } },
      _count: { select: { issues: true, sprints: true } },
    },
  })

  return NextResponse.json(project, { status: 201 })
}
