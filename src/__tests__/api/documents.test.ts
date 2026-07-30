/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/documents/route"
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

describe("GET /api/documents", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/documents?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/documents")
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/documents?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/documents?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns documents for project", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())
    const documents = [
      { id: "doc-1", title: "Readme", children: [], user: { id: "user-1", name: "Test" } },
    ]
    mockDb.document.findMany.mockResolvedValue(documents)

    const request = createNextRequest("http://localhost:3000/api/documents?projectId=proj-1")
    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(documents)
  })
})

describe("POST /api/documents", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/documents", {
      method: "POST",
      body: JSON.stringify({ title: "Doc", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when title or projectId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/documents", {
      method: "POST",
      body: JSON.stringify({ projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when project not found", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/documents", {
      method: "POST",
      body: JSON.stringify({ title: "Doc", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it("creates document with default sortOrder", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.document.aggregate.mockResolvedValue({ _max: { sortOrder: null } })
    mockDb.document.create.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/documents", {
      method: "POST",
      body: JSON.stringify({ title: "First Doc", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    expect(mockDb.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sortOrder: 1000 }),
      }),
    )
  })

  it("creates a document successfully", async () => {
    mockAuthenticated()
    mockDb.project.findUnique.mockResolvedValue({ id: "proj-1", organizationId: "org-1" } as any)
    mockDb.document.aggregate.mockResolvedValue({ _max: { sortOrder: 5000 } })
    const created = {
      id: "doc-new",
      title: "New Doc",
      content: "",
      projectId: "proj-1",
      parentId: null,
      userId: "user-1",
      sortOrder: 6000,
      user: { id: "user-1", name: "Test" },
    }
    mockDb.document.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/documents", {
      method: "POST",
      body: JSON.stringify({ title: "New Doc", projectId: "proj-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
    const body = await response.json()
    expect(body).toEqual(created)
    expect(mockDb.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "New Doc",
          projectId: "proj-1",
          sortOrder: 6000,
        }),
      }),
    )
  })
})
