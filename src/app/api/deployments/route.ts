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
    return NextResponse.json({ error: "projectId required" }, { status: 400 })
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

  const deployments = await db.deployment.findMany({
    where: { projectId },
    include: {
      deployedBy: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(deployments)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { projectId, environment, commitSha, commitMessage, branch } = body

  if (!projectId || !environment) {
    return NextResponse.json(
      { error: "projectId and environment are required" },
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
        include: { rolePermissions: { include: { permission: true } } },
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const deployment = await db.deployment.create({
    data: {
      projectId,
      environment,
      status: "pending",
      commitSha,
      commitMessage,
      branch: branch ?? "main",
      deployedById: session.user.id,
    },
    include: {
      deployedBy: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(deployment, { status: 201 })
}
