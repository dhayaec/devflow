/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/sprints/route"
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

describe("GET /api/sprints", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/sprints?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/sprints")
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/sprints?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/sprints?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns sprints with issue count", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const sprints = [
      {
        id: "sprint-1",
        title: "Sprint 1",
        goal: "Ship feature",
        projectId: "proj-1",
        status: "active",
        startDate: null,
        endDate: null,
        createdAt: new Date().toISOString(),
        _count: { issues: 3 },
      },
    ]
    mockDb.sprint.findMany.mockResolvedValue(sprints)

    const request = createNextRequest("http://localhost:3000/api/sprints?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(sprints)
  })
})

describe("POST /api/sprints", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/sprints", {
      method: "POST",
      body: JSON.stringify({ title: "Sprint 1", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when title or projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/sprints", {
      method: "POST",
      body: JSON.stringify({ projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/sprints", {
      method: "POST",
      body: JSON.stringify({ title: "Sprint 1", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when lacks project.edit permission", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const request = createNextRequest("http://localhost:3000/api/sprints", {
      method: "POST",
      body: JSON.stringify({ title: "Sprint 1", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("creates a sprint successfully", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })

    const created = {
      id: "sprint-new",
      title: "Sprint 1",
      goal: null,
      projectId: "proj-1",
      status: "planning",
      startDate: null,
      endDate: null,
      createdAt: new Date().toISOString(),
    }
    mockDb.sprint.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/sprints", {
      method: "POST",
      body: JSON.stringify({ title: "Sprint 1", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(created)
  })
})
