import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "path"
import { execSync } from "child_process"
import bcrypt from "bcryptjs"
import type { FullConfig } from "@playwright/test"

const permissionsList = [
  { action: "organization.view", description: "View organization", category: "organization" },
  { action: "organization.edit", description: "Edit organization", category: "organization" },
  { action: "organization.delete", description: "Delete organization", category: "organization" },
  { action: "organization.transfer", description: "Transfer ownership", category: "organization" },
  { action: "project.create", description: "Create projects", category: "project" },
  { action: "project.view", description: "View projects", category: "project" },
  { action: "project.edit", description: "Edit projects", category: "project" },
  { action: "project.delete", description: "Delete projects", category: "project" },
  { action: "project.archive", description: "Archive projects", category: "project" },
  { action: "issue.create", description: "Create issues", category: "issue" },
  { action: "issue.view", description: "View issues", category: "issue" },
  { action: "issue.edit", description: "Edit issues", category: "issue" },
  { action: "issue.delete", description: "Delete issues", category: "issue" },
  { action: "issue.assign", description: "Assign issues", category: "issue" },
  { action: "issue.close", description: "Close issues", category: "issue" },
  { action: "issue.move", description: "Move issues", category: "issue" },
  { action: "comment.create", description: "Create comments", category: "comment" },
  { action: "comment.edit", description: "Edit comments", category: "comment" },
  { action: "comment.delete", description: "Delete comments", category: "comment" },
  { action: "attachment.upload", description: "Upload attachments", category: "attachment" },
  { action: "attachment.delete", description: "Delete attachments", category: "attachment" },
  { action: "member.invite", description: "Invite members", category: "member" },
  { action: "member.remove", description: "Remove members", category: "member" },
  { action: "member.manage_roles", description: "Manage member roles", category: "member" },
  { action: "team.create", description: "Create teams", category: "team" },
  { action: "team.edit", description: "Edit teams", category: "team" },
  { action: "team.delete", description: "Delete teams", category: "team" },
  { action: "channel.create", description: "Create channels", category: "channel" },
  { action: "channel.edit", description: "Edit channels", category: "channel" },
  { action: "channel.delete", description: "Delete channels", category: "channel" },
  { action: "billing.view", description: "View billing", category: "billing" },
  { action: "billing.manage", description: "Manage billing", category: "billing" },
  { action: "settings.view", description: "View settings", category: "settings" },
  { action: "settings.manage", description: "Manage settings", category: "settings" },
  { action: "admin.impersonate", description: "Impersonate users", category: "admin" },
  { action: "admin.audit_log", description: "View audit logs", category: "admin" },
]

async function setupDatabase() {
  const dbDir = __dirname
  const dbPath = path.join(dbDir, "e2e.db")

  // Clean up any existing test DB
  try {
    execSync(`del "${dbPath}" 2>nul || rm -f "${dbPath}"`, { shell: true })
    execSync(`del "${dbPath}-journal" 2>nul || rm -f "${dbPath}-journal"`, { shell: true })
  } catch {
    // ignore
  }

  // Push schema to test database
  execSync(
    `cd "${path.resolve(__dirname, "..")}" && npx prisma db push --accept-data-loss 2>&1`,
    {
      stdio: "pipe",
      env: {
        ...process.env,
        DATABASE_URL: `file:${dbPath}`,
        PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: "yes",
      },
    },
  )

  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  const prisma = new PrismaClient({ adapter })

  try {
    // Create permissions
    const permissionMap = new Map<string, string>()
    for (const perm of permissionsList) {
      const created = await prisma.permission.upsert({
        where: { action: perm.action },
        update: {},
        create: perm,
      })
      permissionMap.set(created.action, created.id)
    }

    // Create test organization
    const org = await prisma.organization.create({
      data: {
        id: "e2e-test-org",
        name: "Test Organization",
        slug: "test-org",
        description: "E2E test organization",
      },
    })

    // Create Owner role with all permissions
    const role = await prisma.role.create({
      data: {
        id: "e2e-owner-role",
        name: "Owner",
        description: "E2E test owner role",
        organizationId: org.id,
        isSystem: true,
        rolePermissions: {
          create: permissionsList.map((p) => ({
            permissionId: permissionMap.get(p.action)!,
          })),
        },
      },
    })

    // Create test user
    const hashedPassword = await bcrypt.hash("E2eTestPass123!", 12)
    const user = await prisma.user.create({
      data: {
        id: "e2e-test-user",
        name: "E2E User",
        email: "e2e@test.devflow",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })

    // Create membership
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        roleId: role.id,
      },
    })

    // Create a default channel for chat
    await prisma.channel.create({
      data: {
        id: "e2e-general-channel",
        name: "general",
        topic: "General discussion",
        organizationId: org.id,
        members: {
          create: { userId: user.id },
        },
      },
    })
  } finally {
    await prisma.$disconnect()
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(_config: FullConfig) {
  console.log("\n[E2E Setup] Preparing test database...")
  await setupDatabase()
  console.log("[E2E Setup] Test database ready.")
}
