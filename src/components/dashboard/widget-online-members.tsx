import { db } from "@/lib/db"

export async function WidgetOnlineMembers({
  organizationId,
}: {
  organizationId: string
}) {
  const members = await db.membership.findMany({
    where: { organizationId },
    include: {
      user: { select: { id: true, name: true, image: true } },
      role: { select: { name: true } },
    },
    take: 10,
  })

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Members</h3>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {m.user.name?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{m.user.name ?? "Unknown"}</p>
              <p className="text-[10px] text-muted-foreground">{m.role.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
