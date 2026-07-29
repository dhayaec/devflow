import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim()
  const organizationId = searchParams.get("organizationId")

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }
  if (!organizationId) {
    return NextResponse.json({ error: "organizationId required" }, { status: 400 })
  }

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId },
    },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const [projects, issues, documents, users] = await Promise.all([
    db.project.findMany({
      where: { organizationId, name: { contains: q } },
      select: { id: true, name: true, slug: true },
      take: 5,
    }),
    db.issue.findMany({
      where: { project: { organizationId }, title: { contains: q } },
      select: { id: true, title: true, project: { select: { slug: true } } },
      take: 5,
    }),
    db.document.findMany({
      where: { project: { organizationId }, title: { contains: q } },
      select: { id: true, title: true, project: { select: { slug: true } } },
      take: 5,
    }),
    db.user.findMany({
      where: {
        memberships: { some: { organizationId } },
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ],
      },
      select: { id: true, name: true, email: true, image: true },
      take: 5,
    }),
  ])

  return NextResponse.json({
    results: {
      projects: projects.map((p) => ({
        type: "project" as const,
        id: p.id,
        label: p.name,
        href: `/${membership ? "" : ""}${p.slug}`,
      })),
      issues: issues.map((i) => ({
        type: "issue" as const,
        id: i.id,
        label: i.title,
        href: "",
      })),
      documents: documents.map((d) => ({
        type: "document" as const,
        id: d.id,
        label: d.title,
        href: "",
      })),
      users: users.map((u) => ({
        type: "user" as const,
        id: u.id,
        label: u.name ?? u.email,
        href: "",
      })),
    },
  })
}
