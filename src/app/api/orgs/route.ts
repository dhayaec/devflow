import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: {
      organization: true,
      role: true,
    },
    orderBy: { organization: { name: "asc" } },
  })

  const orgs = memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }))

  return NextResponse.json(orgs)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const body = await request.json()
  const { name, slug, description } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 })
  }

  const existing = await db.organization.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Organization slug already exists" }, { status: 409 })
  }

  const seedOrg = await db.organization.findUnique({
    where: { id: "seed-org" },
    include: {
      roles: {
        where: { isSystem: true },
        include: {
          rolePermissions: true,
        },
      },
    },
  })

  const org = await db.organization.create({
    data: {
      name,
      slug,
      description,
    },
  })

  const ownerRole = seedOrg?.roles.find((r) => r.name === "Owner")

  await db.membership.create({
    data: {
      userId: session.user.id,
      organizationId: org.id,
      roleId: ownerRole?.id ?? (await getOrCreateOwnerRole(org.id)).id,
    },
  })

  if (seedOrg) {
    for (const role of seedOrg.roles) {
      if (role.name === "Owner") continue

      await db.role.create({
        data: {
          name: role.name,
          description: role.description,
          organizationId: org.id,
          isSystem: false,
          rolePermissions: {
            create: role.rolePermissions.map((rp) => ({
              permissionId: rp.permissionId,
            })),
          },
        },
      })
    }
  }

  return NextResponse.json(org, { status: 201 })
}

async function getOrCreateOwnerRole(organizationId: string) {
  return db.role.create({
    data: {
      name: "Owner",
      description: "Full access to the organization",
      organizationId,
      isSystem: false,
      rolePermissions: {
        create: (await db.permission.findMany()).map((p) => ({
          permissionId: p.id,
        })),
      },
    },
  })
}
