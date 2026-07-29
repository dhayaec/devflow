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
    return NextResponse.json({ error: "projectId is required" }, { status: 400 })
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

  const labels = await db.label.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(labels)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, color, projectId } = body

  if (!name || !projectId) {
    return NextResponse.json(
      { error: "name and projectId are required" },
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

  const existing = await db.label.findUnique({
    where: { name_projectId: { name, projectId } },
  })
  if (existing) {
    return NextResponse.json(
      { error: "Label with this name already exists" },
      { status: 409 },
    )
  }

  const label = await db.label.create({
    data: {
      name,
      color: color ?? "#6366f1",
      projectId,
    },
  })

  return NextResponse.json(label, { status: 201 })
}
