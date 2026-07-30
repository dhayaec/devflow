import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { PresenceAvatars } from "@/features/collaboration/components/presence-avatars"
import { MobileNav } from "@/components/layout/mobile-nav"

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { orgSlug } = await params

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) notFound()

  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      organizationId: org.id,
    },
  })

  if (!membership) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgSlug={orgSlug} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex items-center justify-end gap-2 px-4 py-1 border-b bg-muted/20 shrink-0">
          <PresenceAvatars userId={session.user.id} orgId={org.id} />
        </div>
        <main id="main-content" className="flex-1 overflow-y-auto bg-muted/40 pb-14 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
