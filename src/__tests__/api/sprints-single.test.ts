/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { PATCH, DELETE } from "@/app/api/sprints/[sprintId]/route"
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

function makeParams(sprintId: string) {
  return { params: Promise.resolve({ sprintId }) }
}

describe("PATCH /api/sprints/[sprintId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("sprint-1"),
    )
    expect(response.status).toBe(401)
  })

  it("returns 404 when sprint not found", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("sprint-1"),
    )
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue({
      id: "sprint-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }),
      makeParams("sprint-1"),
    )
    expect(response.status).toBe(403)
  })

  it("returns 403 when lacks project.edit permission", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue({
      id: "sprint-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ status: "active" }) }),
      makeParams("sprint-1"),
    )
    expect(response.status).toBe(403)
  })

  it("updates sprint fields", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue({
      id: "sprint-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })

    const updated = {
      id: "sprint-1",
      title: "Sprint 1",
      goal: "Release v2",
      status: "active",
      projectId: "proj-1",
      startDate: null,
      endDate: null,
      createdAt: new Date().toISOString(),
    }
    mockDb.sprint.update.mockResolvedValue(updated)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", {
        method: "PATCH",
        body: JSON.stringify({ status: "active", goal: "Release v2" }),
      }),
      makeParams("sprint-1"),
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(updated)
  })
})

describe("DELETE /api/sprints/[sprintId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("sprint-1"))
    expect(response.status).toBe(401)
  })

  it("returns 404 when sprint not found", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("sprint-1"))
    expect(response.status).toBe(404)
  })

  it("returns 403 when lacks project.delete permission", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue({
      id: "sprint-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createViewerRole(),
    })

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("sprint-1"))
    expect(response.status).toBe(403)
  })

  it("deletes sprint successfully", async () => {
    mockAuthenticated()
    mockDb.sprint.findUnique.mockResolvedValue({
      id: "sprint-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue({
      ...createMembership(),
      role: createAdminRole(),
    })
    mockDb.sprint.delete.mockResolvedValue({} as any)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("sprint-1"))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
  })
})
