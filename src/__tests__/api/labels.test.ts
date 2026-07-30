/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/labels/route"
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

describe("GET /api/labels", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/labels?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/labels")
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/labels?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/labels?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns labels sorted by name", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const labels = [
      { id: "label-1", name: "bug", color: "#ef4444", projectId: "proj-1" },
      { id: "label-2", name: "feature", color: "#22c55e", projectId: "proj-1" },
    ]
    mockDb.label.findMany.mockResolvedValue(labels)

    const request = createNextRequest("http://localhost:3000/api/labels?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(labels)
  })
})

describe("POST /api/labels", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ name: "bug", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when name or projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ name: "bug", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it("returns 409 when label name already exists in project", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.label.findUnique.mockResolvedValue({ id: "existing", name: "bug", projectId: "proj-1" } as any)

    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ name: "bug", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(409)
    const body = await response.json()
    expect(body).toEqual({ error: "Label with this name already exists" })
  })

  it("uses default color when not provided", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.label.findUnique.mockResolvedValue(null)
    mockDb.label.create.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ name: "urgent", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(mockDb.label.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ color: "#6366f1" }),
      }),
    )
  })

  it("creates a label successfully", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.label.findUnique.mockResolvedValue(null)
    const created = {
      id: "label-new",
      name: "bug",
      color: "#ef4444",
      projectId: "proj-1",
    }
    mockDb.label.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/labels", {
      method: "POST",
      body: JSON.stringify({ name: "bug", color: "#ef4444", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(created)
  })
})
