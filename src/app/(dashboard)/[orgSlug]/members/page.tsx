import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { AddMemberDialog } from "@/components/members/add-member-dialog"

const USER_TYPE_LABELS: Record<string, string> = {
  member: "Member",
  contractor: "Contractor",
  intern: "Intern",
  external: "External",
}

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
          userType: true,
        },
      },
      role: true,
    },
    orderBy: { joinedAt: "asc" },
  })

  const roles = await db.role.findMany({
    where: { organizationId: org.id },
    orderBy: { name: "asc" },
  })

  type Member = (typeof members)[number]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AddMemberDialog organizationId={org.id} roles={roles} />
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-[1fr_120px_140px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/20">
          <span>User</span>
          <span>Type</span>
          <span>Role</span>
        </div>
        {members.map((member: Member) => (
          <div
            key={member.id}
            className="grid grid-cols-[1fr_120px_140px] gap-4 p-4 border-b last:border-b-0 items-center"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                {member.user.name?.[0] ?? member.user.email[0]}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{member.user.name ?? "Unknown"}</p>
                <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {USER_TYPE_LABELS[member.user.userType] ?? member.user.userType}
            </span>
            <span className="text-sm text-muted-foreground">{member.role.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
