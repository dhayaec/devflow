import { vi } from "vitest"
import { auth } from "@/auth"

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type RolePermission = {
  permission: { action: string }
}

type MembershipRole = {
  role: {
    rolePermissions: RolePermission[]
  }
}

type Membership = {
  id: string
  userId: string
  organizationId: string
  roleId: string
  role?: MembershipRole["role"]
}

export function mockAuthenticated(user: Partial<SessionUser> = {}) {
  const defaultUser: SessionUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    image: null,
  }

  vi.mocked(auth).mockResolvedValue({
    user: { ...defaultUser, ...user },
    expires: new Date(Date.now() + 86400000).toISOString(),
  })
}

export function mockUnauthenticated() {
  vi.mocked(auth).mockResolvedValue(null)
}

export function createMembership(overrides: Partial<Membership> = {}): Membership {
  return {
    id: "membership-1",
    userId: "user-1",
    organizationId: "org-1",
    roleId: "role-1",
    ...overrides,
  }
}

export function createAdminRole(): MembershipRole["role"] {
  return {
    rolePermissions: [
      { permission: { action: "project.create" } },
      { permission: { action: "project.view" } },
      { permission: { action: "project.edit" } },
      { permission: { action: "project.delete" } },
      { permission: { action: "issue.create" } },
      { permission: { action: "issue.view" } },
      { permission: { action: "issue.edit" } },
      { permission: { action: "issue.delete" } },
      { permission: { action: "issue.assign" } },
      { permission: { action: "comment.create" } },
      { permission: { action: "comment.edit" } },
      { permission: { action: "comment.delete" } },
      { permission: { action: "sprint.create" } },
      { permission: { action: "sprint.edit" } },
      { permission: { action: "label.create" } },
      { permission: { action: "channel.create" } },
    ],
  }
}

export function createViewerRole(): MembershipRole["role"] {
  return {
    rolePermissions: [
      { permission: { action: "project.view" } },
      { permission: { action: "issue.view" } },
    ],
  }
}

export function createNextRequest(
  url: string,
  init?: RequestInit,
) {
  const request = new Request(url, init) as Request & { nextUrl?: URL }
  request.nextUrl = new URL(url, "http://localhost:3000")
  return request as unknown as import("next/server").NextRequest
}

export async function getResponseJson(response: Response): Promise<unknown> {
  return response.json()
}
