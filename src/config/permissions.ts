export const Permissions = {
  // Organization
  organization_view: "organization.view",
  organization_edit: "organization.edit",
  organization_delete: "organization.delete",
  organization_transfer: "organization.transfer",
  // Project
  project_create: "project.create",
  project_view: "project.view",
  project_edit: "project.edit",
  project_delete: "project.delete",
  project_archive: "project.archive",
  // Issue
  issue_create: "issue.create",
  issue_view: "issue.view",
  issue_edit: "issue.edit",
  issue_delete: "issue.delete",
  issue_assign: "issue.assign",
  issue_close: "issue.close",
  issue_move: "issue.move",
  // Comment
  comment_create: "comment.create",
  comment_edit: "comment.edit",
  comment_delete: "comment.delete",
  // Attachment
  attachment_upload: "attachment.upload",
  attachment_delete: "attachment.delete",
  // Member
  member_invite: "member.invite",
  member_remove: "member.remove",
  member_manage_roles: "member.manage_roles",
  // Team
  team_create: "team.create",
  team_edit: "team.edit",
  team_delete: "team.delete",
  // Channel
  channel_create: "channel.create",
  channel_edit: "channel.edit",
  channel_delete: "channel.delete",
  // Billing
  billing_view: "billing.view",
  billing_manage: "billing.manage",
  // Settings
  settings_view: "settings.view",
  settings_manage: "settings.manage",
  // Admin
  admin_impersonate: "admin.impersonate",
  admin_audit_log: "admin.audit_log",
} as const

export type Permission = (typeof Permissions)[keyof typeof Permissions]

export const ALL_PERMISSIONS = Object.values(Permissions)

export const PERMISSION_CATEGORIES = [
  "organization",
  "project",
  "issue",
  "comment",
  "attachment",
  "member",
  "team",
  "channel",
  "billing",
  "settings",
  "admin",
] as const

export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number]
