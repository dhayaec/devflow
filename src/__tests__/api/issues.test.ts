/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/issues/route"
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

describe("GET /api/issues", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/issues?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when projectId is missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/issues")
    const response = await GET(request)
    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body).toEqual({ error: "projectId query parameter is required" })
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/issues?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/issues?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns issues with filters", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const issues = [
      {
        id: "issue-1",
        title: "Test issue",
        status: "backlog",
        priority: "medium",
        type: "task",
        projectId: "proj-1",
        sortOrder: 1000,
        assignee: null,
        reporter: { id: "user-1", name: "Test User", image: null },
        sprint: null,
        labels: [],
        _count: { comments: 0, attachments: 0, checklists: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    mockDb.issue.findMany.mockResolvedValue(issues)

    const request = createNextRequest(
      "http://localhost:3000/api/issues?projectId=proj-1&status=backlog&assigneeId=user-1",
    )
    const response = await GET(request)
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual(issues)
    expect(mockDb.issue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ projectId: "proj-1", status: "backlog", assigneeId: "user-1" }),
      }),
    )
  })
})

describe("POST /api/issues", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ title: "Test", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when title or projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ title: "Test", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ title: "Test", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("returns 403 when lacks issue.create permission", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ title: "Test", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("creates an issue successfully", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.issue.aggregate.mockResolvedValue({ _max: { sortOrder: 5000 } })
    const created = {
      id: "issue-new",
      title: "New issue",
      description: null,
      type: "task",
      priority: "medium",
      status: "backlog",
      projectId: "proj-1",
      sprintId: null,
      reporterId: "user-1",
      assigneeId: null,
      parentId: null,
      dueDate: null,
      estimate: null,
      sortOrder: 6000,
      assignee: null,
      reporter: { id: "user-1", name: "Test User", image: null },
      sprint: null,
      labels: [],
      _count: { comments: 0, attachments: 0, checklists: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockDb.issue.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/issues", {
      method: "POST",
      body: JSON.stringify({ title: "New issue", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)

    const body = await response.json()
    expect(body).toEqual(created)
    expect(mockDb.issue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "New issue",
          projectId: "proj-1",
          reporterId: "user-1",
          sortOrder: 6000,
        }),
      }),
    )
  })
})
