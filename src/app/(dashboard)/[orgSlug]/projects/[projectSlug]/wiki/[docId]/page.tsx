import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { WikiEditor } from "./wiki-editor"

export default async function WikiDocPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string; docId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, projectSlug, docId } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const project = await db.project.findUnique({
    where: {
      organizationId_slug: { slug: projectSlug, organizationId: org.id },
    },
  })
  if (!project) notFound()

  const doc = await db.document.findUnique({
    where: { id: docId },
    include: {
      user: { select: { id: true, name: true, image: true } },
      parent: { select: { id: true, title: true } },
    },
  })

  if (!doc || doc.projectId !== project.id) notFound()

  return (
    <WikiEditor
      doc={{
        id: doc.id,
        title: doc.title,
        content: doc.content,
        isPublished: doc.isPublished,
        parentId: doc.parentId,
      }}
      parent={doc.parent ?? undefined}
      orgSlug={orgSlug}
      projectSlug={projectSlug}
    />
  )
}
