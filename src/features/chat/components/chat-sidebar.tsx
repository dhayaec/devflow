import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { CreateChannelDialog } from "./create-channel-dialog"

export async function ChatSidebar({
  orgSlug,
  organizationId,
  activeChannelId,
}: {
  orgSlug: string
  organizationId: string
  activeChannelId?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const channels = await db.channel.findMany({
    where: {
      organizationId,
      OR: [
        { isPrivate: false },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: {
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="w-60 border-r bg-muted/20 flex flex-col">
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Channels
        </h2>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {channels.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-4 text-center">
            No channels yet
          </p>
        )}
        {channels.map((channel: (typeof channels)[number]) => (
          <Link
            key={channel.id}
            href={`/${orgSlug}/chat/${channel.id}`}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeChannelId === channel.id
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-muted-foreground">#</span>
            <span className="flex-1 truncate">{channel.name}</span>
            {channel._count.messages > 0 && (
              <span className="text-xs text-muted-foreground">{channel._count.messages}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="sticky bottom-0 border-t bg-muted/20">
        <CreateChannelDialog organizationId={organizationId} orgSlug={orgSlug} />
      </div>
    </div>
  )
}
