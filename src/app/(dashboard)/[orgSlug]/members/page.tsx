import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function OrgMembersPage({
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

  const members = await db.membership.findMany({
    where: { organizationId: org.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      role: true,
    },
    orderBy: { joinedAt: "asc" },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {member.user.name?.[0] ?? member.user.email[0]}
              </div>
              <div>
                <p className="font-medium">{member.user.name ?? "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{member.user.email}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{member.role.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
