/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/orgs/route"
import { mockDb } from "@/__tests__/setup"
import {
  mockAuthenticated,
  mockUnauthenticated,
  createNextRequest,
} from "@/__tests__/helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GET /api/orgs", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await GET()
    expect(response.status).toBe(401)
  })

  it("returns user organizations", async () => {
    mockAuthenticated()
    const memberships = [
      {
        organization: { id: "org-1", name: "Org 1", slug: "org-1" },
        role: { id: "role-1", name: "Admin" },
      },
      {
        organization: { id: "org-2", name: "Org 2", slug: "org-2" },
        role: { id: "role-2", name: "Member" },
      },
    ]
    mockDb.membership.findMany.mockResolvedValue(memberships)

    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveLength(2)
    expect(body[0]).toMatchObject({ id: "org-1", name: "Org 1" })
    expect(body[1]).toMatchObject({ id: "org-2", name: "Org 2" })
  })
})

describe("POST /api/orgs", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/orgs", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when name or slug missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/orgs", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 409 when slug exists", async () => {
    mockAuthenticated()
    mockDb.organization.findUnique.mockResolvedValue({ id: "existing", slug: "test" } as any)

    const request = createNextRequest("http://localhost:3000/api/orgs", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(409)
  })

  it("creates organization without seed org", async () => {
    mockAuthenticated()
    mockDb.organization.findUnique
      .mockResolvedValueOnce(null) // no existing org with slug
      .mockResolvedValueOnce(null) // no seed org
    mockDb.organization.create.mockResolvedValue({ id: "org-new", name: "New Org", slug: "new-org" })
    mockDb.permission.findMany.mockResolvedValue([{ id: "perm-1", action: "org.admin" }])
    mockDb.role.create.mockResolvedValue({ id: "role-new" })
    mockDb.membership.create.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/orgs", {
      method: "POST",
      body: JSON.stringify({ name: "New Org", slug: "new-org" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(mockDb.organization.create).toHaveBeenCalled()
    expect(mockDb.membership.create).toHaveBeenCalled()
    expect(mockDb.role.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: "Owner" }),
      }),
    )
  })

  it("copies roles from seed org", async () => {
    mockAuthenticated()
    const seedOrg = {
      id: "seed-org",
      roles: [
        {
          id: "owner-role",
          name: "Owner",
          isSystem: true,
          description: "Owner role",
          rolePermissions: [],
        },
        {
          id: "member-role",
          name: "Member",
          isSystem: true,
          description: "Member role",
          rolePermissions: [
            { id: "rp-1", permissionId: "perm-1" },
          ],
        },
      ],
    }
    mockDb.organization.findUnique
      .mockResolvedValueOnce(null) // no existing slug match
      .mockResolvedValueOnce(seedOrg) // seed org found
    mockDb.organization.create.mockResolvedValue({ id: "org-new", name: "New Org", slug: "new-org" })
    mockDb.membership.create.mockResolvedValue({} as any)
    mockDb.role.create.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/orgs", {
      method: "POST",
      body: JSON.stringify({ name: "New Org", slug: "new-org" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
  })
})
