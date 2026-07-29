import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ChatSidebar } from "@/features/chat/components/chat-sidebar"
import { ChatMessages } from "@/features/chat/components/chat-messages"
import { ChatInput } from "@/features/chat/components/chat-input"

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ orgSlug: string; channelId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug, channelId } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId: org.id },
    },
  })
  if (!membership) notFound()

  const channel = await db.channel.findUnique({ where: { id: channelId } })
  if (!channel || channel.organizationId !== org.id) notFound()

  if (channel.isPrivate) {
    const channelMember = await db.channelMember.findUnique({
      where: { channelId_userId: { channelId, userId: session.user.id } },
    })
    if (!channelMember) notFound()
  }

  const messages = await db.message.findMany({
    where: { channelId, parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar orgSlug={orgSlug} organizationId={org.id} activeChannelId={channelId} />
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b">
          <h1 className="text-sm font-semibold"># {channel.name}</h1>
          {channel.topic && (
            <p className="text-xs text-muted-foreground mt-0.5">{channel.topic}</p>
          )}
        </div>
        <ChatMessages
          channelId={channelId}
          sessionUserId={session.user.id}
          initialMessages={JSON.parse(JSON.stringify(messages))}
        />
        <ChatInput
          channelId={channelId}
          sessionUserId={session.user.id}
          sessionUserName={session.user.name ?? null}
        />
      </div>
    </div>
  )
}
