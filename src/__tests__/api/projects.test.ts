/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/projects/route"
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

describe("GET /api/projects", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()

    const request = createNextRequest("http://localhost:3000/api/projects?orgId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body).toEqual({ error: "Not authenticated" })
  })

  it("returns 400 when orgId is missing", async () => {
    mockAuthenticated()

    const request = createNextRequest("http://localhost:3000/api/projects")
    const response = await GET(request)
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body).toEqual({ error: "orgId query parameter is required" })
  })

  it("returns 403 when user is not a member", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/projects?orgId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(403)

    const body = await response.json()
    expect(body).toEqual({ error: "Not a member" })
  })

  it("returns projects list for a member", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const projects = [
      {
        id: "project-1",
        name: "Project Alpha",
        slug: "project-alpha",
        description: "First project",
        icon: "rocket",
        organizationId: "org-1",
        leadId: "user-1",
        lead: { id: "user-1", name: "Test User", image: null },
        _count: { issues: 5, sprints: 2 },
        isArchived: false,
        startDate: null,
        endDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    mockDb.project.findMany.mockResolvedValue(projects)

    const request = createNextRequest("http://localhost:3000/api/projects?orgId=org-1")
    const response = await GET(request)
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual(projects)
    expect(mockDb.project.findMany).toHaveBeenCalledWith({
      where: { organizationId: "org-1", isArchived: false },
      include: {
        lead: { select: { id: true, name: true, image: true } },
        _count: { select: { issues: true, sprints: true } },
      },
      orderBy: { updatedAt: "desc" },
    })
  })
})

describe("POST /api/projects", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when required fields are missing", async () => {
    mockAuthenticated()

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body).toEqual({ error: "name, slug, and organizationId are required" })
  })

  it("returns 403 when membership not found", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("returns 403 when user lacks project.create permission", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)

    const body = await response.json()
    expect(body).toEqual({ error: "Insufficient permissions" })
  })

  it("returns 409 when slug already exists", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.project.findUnique.mockResolvedValue({
      id: "existing",
      name: "Existing",
    } as any)

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "existing-slug", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(409)

    const body = await response.json()
    expect(body).toEqual({ error: "A project with this slug already exists" })
  })

  it("creates a project with startDate and endDate", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.project.findUnique.mockResolvedValue(null)
    mockDb.project.create.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "Scheduled", slug: "scheduled", organizationId: "org-1",
        startDate: "2026-08-01T00:00:00.000Z", endDate: "2026-12-31T00:00:00.000Z",
      }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(mockDb.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        }),
      }),
    )
  })

  it("creates a project successfully", async () => {
    mockAuthenticated()
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.project.findUnique.mockResolvedValue(null) // no duplicate
    const created = {
      id: "project-new",
      name: "New Project",
      slug: "new-project",
      description: null,
      icon: null,
      organizationId: "org-1",
      leadId: null,
      lead: null,
      _count: { issues: 0, sprints: 0 },
      startDate: null,
      endDate: null,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const createdWithStrings = { ...created, createdAt: created.createdAt.toISOString(), updatedAt: created.updatedAt.toISOString() }
    mockDb.project.create.mockResolvedValue(createdWithStrings)

    const request = createNextRequest("http://localhost:3000/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "New Project", slug: "new-project", organizationId: "org-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)

    const body = await response.json()
    expect(body).toEqual(createdWithStrings)
    expect(mockDb.project.create).toHaveBeenCalledWith({
      data: {
        name: "New Project",
        slug: "new-project",
        description: undefined,
        icon: undefined,
        organizationId: "org-1",
        leadId: null,
        startDate: null,
        endDate: null,
      },
      include: {
        lead: { select: { id: true, name: true, image: true } },
        _count: { select: { issues: true, sprints: true } },
      },
    })
  })
})
