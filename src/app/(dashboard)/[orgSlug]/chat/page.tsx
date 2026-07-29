import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ChatSidebar } from "@/features/chat/components/chat-sidebar"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug } = await params

  const org = await db.organization.findUnique({ where: { slug: orgSlug } })
  if (!org) notFound()

  const membership = await db.membership.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId: org.id },
    },
  })
  if (!membership) notFound()

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar orgSlug={orgSlug} organizationId={org.id} />
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        Select a channel to start chatting
      </div>
    </div>
  )
}
