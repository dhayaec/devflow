/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, PATCH, DELETE } from "@/app/api/issues/[issueId]/route"
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

function makeParams(issueId: string) {
  return { params: Promise.resolve({ issueId }) }
}

describe("GET /api/issues/[issueId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await GET(createNextRequest("http://localhost:3000"), makeParams("issue-1"))
    expect(response.status).toBe(401)
  })

  it("returns 404 when issue not found", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue(null)

    const response = await GET(createNextRequest("http://localhost:3000"), makeParams("issue-1"))
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await GET(createNextRequest("http://localhost:3000"), makeParams("issue-1"))
    expect(response.status).toBe(403)
  })

  it("returns issue with full includes", async () => {
    mockAuthenticated()
    const issue = {
      id: "issue-1",
      title: "Test issue",
      project: { id: "proj-1", slug: "proj", organizationId: "org-1", name: "Project" },
      assignee: null,
      reporter: { id: "user-1", name: "Test", image: null },
      sprint: null,
      labels: [],
      checklists: [],
      watchers: [],
      attachments: [],
      comments: [],
      description: null,
      status: "backlog",
      priority: "medium",
      type: "task",
      sortOrder: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockDb.issue.findUnique.mockResolvedValue(issue)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const response = await GET(createNextRequest("http://localhost:3000"), makeParams("issue-1"))
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual(issue)
  })
})

describe("PATCH /api/issues/[issueId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(401)
  })

  it("returns 404 when issue not found", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(403)
  })

  it("returns 403 when lacks issue.edit permission", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(403)
  })

  it("clears dueDate with null", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.issue.update.mockResolvedValue({} as any)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", {
        method: "PATCH",
        body: JSON.stringify({ dueDate: null }),
      }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(200)
    expect(mockDb.issue.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ dueDate: null }),
      }),
    )
  })

  it("updates dueDate field", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.issue.update.mockResolvedValue({} as any)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", {
        method: "PATCH",
        body: JSON.stringify({ dueDate: "2026-09-01T00:00:00.000Z" }),
      }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(200)
    expect(mockDb.issue.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ dueDate: expect.any(Date) }),
      }),
    )
  })

  it("updates allowed fields", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    const updated = {
      id: "issue-1",
      title: "Updated title",
      status: "in_progress",
      assignee: null,
      reporter: { id: "user-1", name: "Test", image: null },
      sprint: null,
      labels: [],
    }
    mockDb.issue.update.mockResolvedValue(updated)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated title", status: "in_progress" }),
      }),
      makeParams("issue-1"),
    )
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual(updated)
    expect(mockDb.issue.update).toHaveBeenCalledWith({
      where: { id: "issue-1" },
      data: { title: "Updated title", status: "in_progress" },
      include: expect.any(Object),
    })
  })
})

describe("DELETE /api/issues/[issueId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("issue-1"))
    expect(response.status).toBe(401)
  })

  it("returns 404 when issue not found", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("issue-1"))
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member on delete", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("issue-1"))
    expect(response.status).toBe(403)
  })

  it("returns 403 when lacks issue.delete permission", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("issue-1"))
    expect(response.status).toBe(403)
  })

  it("deletes issue successfully", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.issue.delete.mockResolvedValue({} as any)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("issue-1"))
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body).toEqual({ success: true })
    expect(mockDb.issue.delete).toHaveBeenCalledWith({ where: { id: "issue-1" } })
  })
})
