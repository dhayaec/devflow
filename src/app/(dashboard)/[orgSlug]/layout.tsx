import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
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
    <div className="flex min-h-screen">
      <Sidebar orgSlug={orgSlug} />
      <div className="flex-1 flex flex-col pb-14 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
