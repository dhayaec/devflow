import "server-only"

import { auth } from "@/auth"
import { db } from "@/lib/db"

export const getSession = auth

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function getCurrentUserWithMembership(orgSlug: string) {
  const user = await getCurrentUser()
  if (!user?.id) return null

  const membership = await db.membership.findFirst({
    where: {
      userId: user.id,
      organization: { slug: orgSlug },
    },
    include: {
      organization: true,
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  })

  return { user, membership }
}
