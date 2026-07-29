import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function DeploymentsPage({
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
    where: { organizationId_slug: { organizationId: org.id, slug: projectSlug } },
  })
  if (!project) notFound()

  const deployments = await db.deployment.findMany({
    where: { projectId: project.id },
    include: {
      deployedBy: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deployments</h1>
      </div>

      {deployments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No deployments yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Deploy your project to see deployment history
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deployments.map((d) => (
            <div key={d.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusBadge status={d.status} />
                  <div>
                    <p className="text-sm font-medium">
                      {d.environment}
                      {d.branch && <span className="text-muted-foreground"> ({d.branch})</span>}
                    </p>
                    {d.commitMessage && (
                      <p className="text-xs text-muted-foreground mt-0.5">{d.commitMessage}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{d.deployedBy.name ?? "Unknown"}</p>
                  <p>{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {d.url && (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {d.url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    running: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? colors.pending}`}>
      {status}
    </span>
  )
}
