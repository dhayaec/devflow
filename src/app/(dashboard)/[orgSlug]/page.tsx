import { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { WidgetStats } from "@/components/dashboard/widget-stats"
import { WidgetRecentProjects } from "@/components/dashboard/widget-recent-projects"
import { WidgetAssignedIssues } from "@/components/dashboard/widget-assigned-issues"
import { WidgetSprintProgress } from "@/components/dashboard/widget-sprint-progress"
import { WidgetOnlineMembers } from "@/components/dashboard/widget-online-members"

function WidgetFallback({ height = "h-32" }: { height?: string }) {
  return (
    <div className={`rounded-lg border p-4 ${height} animate-pulse bg-muted/20`} />
  )
}

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug } = await params

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) notFound()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{org.name}</h1>
        {org.description && (
          <p className="text-muted-foreground mt-1">{org.description}</p>
        )}
      </div>

      <Suspense fallback={<WidgetFallback height="h-24" />}>
        <WidgetStats organizationId={org.id} orgSlug={orgSlug} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<WidgetFallback />}>
          <WidgetRecentProjects organizationId={org.id} orgSlug={orgSlug} />
        </Suspense>
        <Suspense fallback={<WidgetFallback />}>
          <WidgetAssignedIssues organizationId={org.id} orgSlug={orgSlug} />
        </Suspense>
        <Suspense fallback={<WidgetFallback />}>
          <WidgetSprintProgress organizationId={org.id} />
        </Suspense>
        <Suspense fallback={<WidgetFallback />}>
          <WidgetOnlineMembers organizationId={org.id} />
        </Suspense>
      </div>
    </div>
  )
}
