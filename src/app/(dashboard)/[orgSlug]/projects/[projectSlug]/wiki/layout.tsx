import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { DocumentTree } from "@/features/documents/components/document-tree"

export default async function WikiLayout({
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
    where: {
      organizationId_slug: { slug: projectSlug, organizationId: org.id },
    },
  })
  if (!project) notFound()

  const documents = await db.document.findMany({
    where: { projectId: project.id, parentId: null },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div className="flex flex-1">
      <aside className="hidden md:block w-56 shrink-0 border-r bg-muted/20 p-2 overflow-y-auto">
        <DocumentTree
          documents={documents}
          orgSlug={orgSlug}
          projectSlug={projectSlug}
          projectId={project.id}
        />
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
