/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { PATCH, DELETE } from "@/app/api/labels/[labelId]/route"
import { mockDb } from "@/__tests__/setup"
import {
  mockAuthenticated,
  mockUnauthenticated,
  createMembership,
  createNextRequest,
} from "@/__tests__/helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

function makeParams(labelId: string) {
  return { params: Promise.resolve({ labelId }) }
}

describe("PATCH /api/labels/[labelId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ name: "Updated" }) }),
      makeParams("label-1"),
    )
    expect(response.status).toBe(401)
  })

  it("returns 404 when label not found", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ name: "Updated" }) }),
      makeParams("label-1"),
    )
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue({
      id: "label-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ name: "Updated" }) }),
      makeParams("label-1"),
    )
    expect(response.status).toBe(403)
  })

  it("updates label name and color", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue({
      id: "label-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const updated = { id: "label-1", name: "critical", color: "#dc2626", projectId: "proj-1" }
    mockDb.label.update.mockResolvedValue(updated)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ name: "critical", color: "#dc2626" }) }),
      makeParams("label-1"),
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(updated)
  })
})

describe("DELETE /api/labels/[labelId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("label-1"))
    expect(response.status).toBe(401)
  })

  it("returns 404 when label not found", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("label-1"))
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue({
      id: "label-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("label-1"))
    expect(response.status).toBe(403)
  })

  it("deletes label successfully", async () => {
    mockAuthenticated()
    mockDb.label.findUnique.mockResolvedValue({
      id: "label-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())
    mockDb.label.delete.mockResolvedValue({} as any)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("label-1"))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
  })
})
