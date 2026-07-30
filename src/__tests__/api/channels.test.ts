/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/channels/route"
import { mockDb } from "@/__tests__/setup"
import {
  mockAuthenticated,
  mockUnauthenticated,
  createMembership,
  createAdminRole,
  createViewerRole,
  createNextRequest,
} from "@/__tests__/helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("GET /api/channels", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/channels?organizationId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when organizationId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/channels")
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/channels?organizationId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns channels for member", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(createMembership())
    const channels = [
      { id: "ch-1", name: "general", _count: { messages: 5 }, members: [] },
      { id: "ch-2", name: "random", _count: { messages: 3 }, members: [] },
    ]
    mockDb.channel.findMany.mockResolvedValue(channels)

    const request = createNextRequest("http://localhost:3000/api/channels?organizationId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(channels)
  })
})

describe("POST /api/channels", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when name or organizationId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("returns 403 when lacks channel.create permission", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("returns 409 when channel already exists", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.channel.findUnique.mockResolvedValue({ id: "existing" } as any)

    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(409)
  })

  it("creates a channel successfully", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.channel.findUnique.mockResolvedValue(null)
    const created = {
      id: "ch-new",
      name: "general",
      organizationId: "org-1",
      members: [{ user: { id: "user-1", name: "Test User", image: null } }],
      _count: { messages: 0 },
    }
    mockDb.channel.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "general", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(created)
  })

  it("creates a channel with memberIds", async () => {
    mockAuthenticated({ id: "user-1" })
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.channel.findUnique.mockResolvedValue(null)
    mockDb.channel.create.mockResolvedValue({ id: "ch-new" } as any)

    const request = createNextRequest("http://localhost:3000/api/channels", {
      method: "POST",
      body: JSON.stringify({ name: "team", organizationId: "org-1", memberIds: ["user-2", "user-3"] }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(mockDb.channel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          members: expect.objectContaining({
            create: expect.arrayContaining([
              { userId: "user-1" },
              { userId: "user-2" },
              { userId: "user-3" },
            ]),
          }),
        }),
      }),
    )
  })
})
