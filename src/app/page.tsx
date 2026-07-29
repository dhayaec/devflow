import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function HomePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    take: 1,
  })

  if (memberships.length > 0) {
    redirect(`/${memberships[0].organization.slug}`)
  }

  redirect("/create-org")
}
