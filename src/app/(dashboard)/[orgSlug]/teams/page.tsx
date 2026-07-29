import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function OrgTeamsPage({
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

  const teams = await db.team.findMany({
    where: { organizationId: org.id },
    orderBy: { name: "asc" },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-muted-foreground">
          {teams.length} team{teams.length !== 1 ? "s" : ""}
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No teams yet. Create your first team to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{team.name}</h3>
              {team.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {team.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
