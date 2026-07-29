import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { deploymentId } = await params

  const deployment = await db.deployment.findUnique({
    where: { id: deploymentId },
    include: {
      deployedBy: { select: { id: true, name: true, image: true } },
      project: { select: { id: true, slug: true, organizationId: true } },
    },
  })

  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: deployment.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  return NextResponse.json(deployment)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { deploymentId } = await params
  const body = await request.json()
  const { status, url, logs } = body

  const deployment = await db.deployment.findUnique({
    where: { id: deploymentId },
    include: { project: { select: { organizationId: true } } },
  })
  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: deployment.project.organizationId,
      },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const updated = await db.deployment.update({
    where: { id: deploymentId },
    data: {
      ...(status !== undefined && { status }),
      ...(url !== undefined && { url }),
      ...(logs !== undefined && { logs }),
      ...(status === "running" && !deployment.startedAt
        ? { startedAt: new Date() }
        : {}),
      ...((status === "success" || status === "failed") && !deployment.finishedAt
        ? { finishedAt: new Date() }
        : {}),
    },
    include: {
      deployedBy: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(updated)
}
