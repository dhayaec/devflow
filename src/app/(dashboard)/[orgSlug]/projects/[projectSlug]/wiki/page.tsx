import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { FileText } from "lucide-react"
import { CreateWikiDialog } from "./create-wiki-dialog"

export default async function WikiPage({
  params,
}: {
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
    where: { projectId: project.id },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wiki</h1>
          <p className="text-sm text-muted-foreground">
            {documents.length} page{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CreateWikiDialog projectId={project.id} orgSlug={orgSlug} projectSlug={projectSlug} />
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <FileText className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No wiki pages yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create documentation for your project
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/${orgSlug}/projects/${projectSlug}/wiki/${doc.id}`}
              className="rounded-lg border p-4 hover:border-ring/50 transition-colors space-y-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <h3 className="font-medium leading-tight">{doc.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {doc._count.children} sub-page{doc._count.children !== 1 ? "s" : ""}
                </span>
                {doc.user.name && <span>by {doc.user.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
