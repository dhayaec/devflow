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
      { error: "projectId is required" },
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

  const documents = await db.document.findMany({
    where: { projectId, parentId: null },
    include: {
      children: { orderBy: { sortOrder: "asc" } },
      user: { select: { id: true, name: true } },
    },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json(documents)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { title, projectId, parentId, content } = body

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

  const maxSort = await db.document.aggregate({
    where: { projectId, parentId: parentId ?? null },
    _max: { sortOrder: true },
  })

  const document = await db.document.create({
    data: {
      title,
      content: content ?? "",
      projectId,
      parentId: parentId ?? null,
      userId: session.user.id,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1000,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(document, { status: 201 })
}
