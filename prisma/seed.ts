import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const OWNER_EMAIL = "owner@devflow.app"
const OWNER_PASSWORD = "owner123"

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

interface SeedIssue {
  title: string
  type: string
  priority: string
  label: string
}

const LABEL_COLORS: Record<string, string> = {
  bug: "#ef4444",
  feature: "#22c55e",
  enhancement: "#3b82f6",
  documentation: "#f59e0b",
}

function labelColor(name: string): string {
  return LABEL_COLORS[name] ?? "#6366f1"
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

  async function getOrCreateUser(
    email: string,
    password: string,
    name: string,
  ) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.log(`  User "${email}" already exists, skipping`)
      return existing
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    })
    console.log(`  Created user: ${user.email}`)
    return user
  }

  async function addUserToOrg(
    user: { id: string },
    organizationId: string,
    orgName: string,
    roleName: string,
  ) {
    const role = await prisma.role.findFirst({
      where: { name: roleName, organizationId },
    })
    if (!role) {
      console.log(`  Role "${roleName}" not found in org "${orgName}", skipping membership`)
      return
    }

    await prisma.membership.upsert({
      where: { userId_organizationId: { userId: user.id, organizationId } },
      update: { roleId: role.id },
      create: {
        userId: user.id,
        organizationId,
        roleId: role.id,
      },
    })
    console.log(`  Added "${user.id}" to "${orgName}" as ${roleName}`)
  }

  console.log("Creating seed users...")
  const ownerUser = await getOrCreateUser(OWNER_EMAIL, OWNER_PASSWORD, "Owner")
  const adminUser = await getOrCreateUser(ADMIN_EMAIL, ADMIN_PASSWORD, "Admin")

  // Add both users to the template org
  await addUserToOrg(ownerUser, seedOrg.id, seedOrg.name, "Owner")
  await addUserToOrg(adminUser, seedOrg.id, seedOrg.name, "Admin")

  // ─── Owner's personal organization ────────────────────────────────────────

  console.log("Creating owner organization...")
  const ownerOrgSlug = "acme-corp"
  let ownerOrg = await prisma.organization.findUnique({ where: { slug: ownerOrgSlug } })
  if (!ownerOrg) {
    ownerOrg = await prisma.organization.create({
      data: {
        name: "Acme Corp",
        slug: ownerOrgSlug,
        description: "Owner's sample organization",
      },
    })
    console.log(`  Created organization: ${ownerOrg.name}`)
  } else {
    console.log(`  Organization "${ownerOrgSlug}" already exists, skipping`)
  }

  // Ensure the owner has an Owner role in their org (create Owner role if needed)
  let ownerOrgOwnerRole = await prisma.role.findFirst({
    where: { name: "Owner", organizationId: ownerOrg.id },
  })
  if (!ownerOrgOwnerRole) {
    ownerOrgOwnerRole = await prisma.role.create({
      data: {
        name: "Owner",
        description: "Default Owner role",
        organizationId: ownerOrg.id,
        isSystem: true,
        rolePermissions: {
          create: ROLE_DEFINITIONS["Owner"]
            .filter((a) => permissionMap.has(a))
            .map((a) => ({ permissionId: permissionMap.get(a)! })),
        },
      },
    })
  }

  await addUserToOrg(ownerUser, ownerOrg.id, ownerOrg.name, "Owner")

  // Also create a project-level role for the owner org
  let devRole = await prisma.role.findFirst({
    where: { name: "Developer", organizationId: ownerOrg.id },
  })
  if (!devRole) {
    devRole = await prisma.role.create({
      data: {
        name: "Developer",
        description: "Default Developer role",
        organizationId: ownerOrg.id,
        isSystem: true,
        rolePermissions: {
          create: ROLE_DEFINITIONS["Developer"]
            .filter((a) => permissionMap.has(a))
            .map((a) => ({ permissionId: permissionMap.get(a)! })),
        },
      },
    })
    console.log(`  Created Developer role in ${ownerOrg.name}`)
  }

  // ─── Projects ────────────────────────────────────────────────────────────

  console.log("Creating projects...")

  interface SeedProject {
    name: string
    slug: string
    description: string
  }

  const seedProjects: SeedProject[] = [
    { name: "Website Redesign", slug: "website-redesign", description: "Complete overhaul of the company website" },
    { name: "Mobile App", slug: "mobile-app", description: "Cross-platform mobile application" },
  ]

  const labelsByProject = new Map<string, string[]>()
  const issuesByProject = new Map<string, SeedIssue[]>()

  for (const proj of seedProjects) {
    let project = await prisma.project.findUnique({
      where: { organizationId_slug: { organizationId: ownerOrg.id, slug: proj.slug } },
    })

    if (project) {
      console.log(`  Project "${proj.name}" already exists, skipping`)
      continue
    }

    project = await prisma.project.create({
      data: {
        name: proj.name,
        slug: proj.slug,
        description: proj.description,
        organizationId: ownerOrg.id,
        leadId: ownerUser.id,
      },
    })
    console.log(`  Created project: ${project.name}`)

    // Labels
    const labelNames = ["bug", "feature", "enhancement", "documentation"]
    const createdLabels: string[] = []
    for (const labelName of labelNames) {
      const label = await prisma.label.upsert({
        where: { name_projectId: { name: labelName, projectId: project.id } },
        update: {},
        create: { name: labelName, color: labelColor(labelName), projectId: project.id },
      })
      createdLabels.push(label.id)
    }
    labelsByProject.set(project.id, createdLabels)

    // Sprint
    const sprint = await prisma.sprint.create({
      data: {
        title: "Sprint 1",
        goal: "Initial setup and core features",
        projectId: project.id,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    // Define per-project issues
    const projIssues: SeedIssue[] =
      project.slug === "website-redesign"
        ? [
            { title: "Design new homepage layout", type: "feature", priority: "high", label: "feature" },
            { title: "Fix navigation bar responsiveness", type: "bug", priority: "high", label: "bug" },
            { title: "Add contact form", type: "feature", priority: "medium", label: "feature" },
            { title: "Write API documentation", type: "task", priority: "low", label: "documentation" },
          ]
        : [
            { title: "Set up project structure", type: "task", priority: "high", label: "enhancement" },
            { title: "Implement user authentication", type: "feature", priority: "high", label: "feature" },
            { title: "Fix login screen crash on Android", type: "bug", priority: "urgent", label: "bug" },
          ]

    for (let i = 0; i < projIssues.length; i++) {
      const issue = projIssues[i]
      const labelIds = labelsByProject.get(project.id) ?? []
      const matchingLabel = createdLabels[labelNames.indexOf(issue.label)]
      const existingIssue = await prisma.issue.findFirst({
        where: { title: issue.title, projectId: project.id },
      })
      if (existingIssue) {
        console.log(`    Issue "${issue.title}" already exists, skipping`)
        continue
      }
      const createdIssue = await prisma.issue.create({
        data: {
          title: issue.title,
          description: `Description for: ${issue.title}`,
          type: issue.type,
          priority: issue.priority,
          status: i === 0 ? "in_progress" : "backlog",
          projectId: project.id,
          sprintId: sprint.id,
          reporterId: ownerUser.id,
          assigneeId: ownerUser.id,
          sortOrder: i,
          labels: matchingLabel
            ? { create: [{ labelId: matchingLabel }] }
            : undefined,
        },
      })
      console.log(`    Created issue: ${createdIssue.title}`)
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
