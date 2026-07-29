import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string; projectSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, projectSlug } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const project = await db.project.findUnique({
    where: { organizationId_slug: { slug: projectSlug, organizationId: org.id } },
    include: {
      lead: { select: { id: true, name: true } },
    },
  })
  if (!project) notFound()

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: org.id,
      },
    },
  })
  if (!membership) notFound()

  const tabs = [
    { label: "Overview", href: `/${orgSlug}/projects/${projectSlug}` },
    { label: "Board", href: `/${orgSlug}/projects/${projectSlug}/board` },
    { label: "Backlog", href: `/${orgSlug}/projects/${projectSlug}/backlog` },
    { label: "Sprints", href: `/${orgSlug}/projects/${projectSlug}/sprints` },
    { label: "Settings", href: `/${orgSlug}/projects/${projectSlug}/settings` },
  ]

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="px-6 pt-4 pb-0">
          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/${orgSlug}/projects`} className="hover:text-foreground">
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{project.name}</span>
          </div>
          <nav className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors aria-[current=page]:border-primary aria-[current=page]:text-foreground"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
