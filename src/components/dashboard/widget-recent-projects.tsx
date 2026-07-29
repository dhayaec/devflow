import { db } from "@/lib/db"
import Link from "next/link"

export async function WidgetRecentProjects({
  organizationId,
  orgSlug,
}: {
  organizationId: string
  orgSlug: string
}) {
  const projects = await db.project.findMany({
    where: { organizationId, isArchived: false },
    include: { _count: { select: { issues: true } } },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Recent Projects</h3>
      {projects.length === 0 ? (
        <p className="text-xs text-muted-foreground">No projects yet</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/${orgSlug}/projects/${p.slug}`}
              className="block rounded-md p-2 hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p._count.issues} issues</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
