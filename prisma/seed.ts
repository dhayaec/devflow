import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const ADMIN_EMAIL = "admin@devflow.app"
const ADMIN_PASSWORD = "admin123"

const PERMISSIONS = [
  // Organization
  { action: "organization.view", description: "View organization", category: "organization" },
  { action: "organization.edit", description: "Edit organization", category: "organization" },
  { action: "organization.delete", description: "Delete organization", category: "organization" },
  { action: "organization.transfer", description: "Transfer ownership", category: "organization" },
  // Project
  { action: "project.create", description: "Create projects", category: "project" },
  { action: "project.view", description: "View projects", category: "project" },
  { action: "project.edit", description: "Edit projects", category: "project" },
  { action: "project.delete", description: "Delete projects", category: "project" },
  { action: "project.archive", description: "Archive projects", category: "project" },
  // Issue
  { action: "issue.create", description: "Create issues", category: "issue" },
  { action: "issue.view", description: "View issues", category: "issue" },
  { action: "issue.edit", description: "Edit issues", category: "issue" },
  { action: "issue.delete", description: "Delete issues", category: "issue" },
  { action: "issue.assign", description: "Assign issues", category: "issue" },
  { action: "issue.close", description: "Close issues", category: "issue" },
  { action: "issue.move", description: "Move issues between projects", category: "issue" },
  // Comment
  { action: "comment.create", description: "Create comments", category: "comment" },
  { action: "comment.edit", description: "Edit comments", category: "comment" },
  { action: "comment.delete", description: "Delete comments", category: "comment" },
  // Attachment
  { action: "attachment.upload", description: "Upload attachments", category: "attachment" },
  { action: "attachment.delete", description: "Delete attachments", category: "attachment" },
  // Member
  { action: "member.invite", description: "Invite members", category: "member" },
  { action: "member.remove", description: "Remove members", category: "member" },
  { action: "member.manage_roles", description: "Manage member roles", category: "member" },
  // Team
  { action: "team.create", description: "Create teams", category: "team" },
  { action: "team.edit", description: "Edit teams", category: "team" },
  { action: "team.delete", description: "Delete teams", category: "team" },
  // Channel
  { action: "channel.create", description: "Create channels", category: "channel" },
  { action: "channel.edit", description: "Edit channels", category: "channel" },
  { action: "channel.delete", description: "Delete channels", category: "channel" },
  // Billing
  { action: "billing.view", description: "View billing", category: "billing" },
  { action: "billing.manage", description: "Manage billing", category: "billing" },
  // Settings
  { action: "settings.view", description: "View settings", category: "settings" },
  { action: "settings.manage", description: "Manage settings", category: "settings" },
  // Admin
  { action: "admin.impersonate", description: "Impersonate users", category: "admin" },
  { action: "admin.audit_log", description: "View audit logs", category: "admin" },
] as const

const ROLE_DEFINITIONS: Record<string, string[]> = {
  Owner: PERMISSIONS.map((p) => p.action),
  Admin: PERMISSIONS.filter(
    (p) => !["organization.delete", "organization.transfer", "admin.impersonate"].includes(p.action),
  ).map((p) => p.action),
  Manager: PERMISSIONS.filter(
    (p) =>
      ![
        "organization.delete",
        "organization.transfer",
        "billing.manage",
        "admin.impersonate",
        "admin.audit_log",
        "settings.manage",
        "member.manage_roles",
        "team.delete",
        "channel.delete",
        "attachment.delete",
      ].includes(p.action),
  ).map((p) => p.action),
  Developer: PERMISSIONS.filter(
    (p) =>
      [
        "project.view",
        "issue.create",
        "issue.view",
        "issue.edit",
        "comment.create",
        "comment.edit",
        "attachment.upload",
        "channel.create",
        "channel.edit",
      ].includes(p.action),
  ).map((p) => p.action),
  Viewer: PERMISSIONS.filter(
    (p) => p.action.endsWith(".view") || p.action === "comment.create",
  ).map((p) => p.action),
  Guest: PERMISSIONS.filter((p) => p.action === "issue.view" || p.action === "comment.create").map(
    (p) => p.action,
  ),
}

async function main() {
  console.log("Seeding permissions...")
  const permissionMap = new Map<string, string>()

  for (const perm of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { action: perm.action },
      update: {},
      create: perm,
    })
    permissionMap.set(created.action, created.id)
  }

  console.log(`  Created ${permissionMap.size} permissions`)

  const seedOrgId = "seed-org"
  let seedOrg = await prisma.organization.findUnique({ where: { id: seedOrgId } })
  if (!seedOrg) {
    seedOrg = await prisma.organization.create({
      data: {
        id: seedOrgId,
        name: "DevFlow Template",
        slug: "devflow-template",
        description: "Template organization with default roles",
      },
    })
    console.log(`  Created template organization: ${seedOrg.name}`)
  }

  console.log("Creating default roles...")

  for (const [roleName, actions] of Object.entries(ROLE_DEFINITIONS)) {
    const existingRole = await prisma.role.findFirst({
      where: { name: roleName, organizationId: seedOrg.id },
    })

    if (existingRole) {
      console.log(`  Role "${roleName}" already exists, skipping`)
      continue
    }

    const role = await prisma.role.create({
      data: {
        name: roleName,
        description: `Default ${roleName} role`,
        organizationId: seedOrg.id,
        isSystem: true,
        rolePermissions: {
          create: actions
            .filter((action) => permissionMap.has(action))
            .map((action) => ({
              permissionId: permissionMap.get(action)!,
            })),
        },
      },
    })

    console.log(`  Created role: ${roleName} (${role.id})`)
  }

  console.log("Creating admin user...")
  const ownerRole = await prisma.role.findFirst({
    where: { name: "Owner", organizationId: seedOrg.id },
  })

  const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (existingAdmin) {
    console.log(`  Admin user "${ADMIN_EMAIL}" already exists, skipping`)
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })
    console.log(`  Created admin user: ${adminUser.email}`)

    if (ownerRole) {
      await prisma.membership.upsert({
        where: { userId_organizationId: { userId: adminUser.id, organizationId: seedOrg.id } },
        update: { roleId: ownerRole.id },
        create: {
          userId: adminUser.id,
          organizationId: seedOrg.id,
          roleId: ownerRole.id,
        },
      })
      console.log(`  Added admin to "${seedOrg.name}" as Owner`)
    }
  }

  console.log("Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
