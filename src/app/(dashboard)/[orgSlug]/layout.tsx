import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

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

  return <>{children}</>
}
