/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/comments/route"
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

describe("GET /api/comments", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/comments?issueId=issue-1")
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when issueId is missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/comments")
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when issue not found", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/comments?issueId=issue-1")
    const response = await GET(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/comments?issueId=issue-1")
    const response = await GET(request)
    expect(response.status).toBe(403)
  })

  it("returns comments list", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const comments = [
      {
        id: "comment-1",
        body: "Test comment",
        issueId: "issue-1",
        userId: "user-1",
        parentId: null,
        isEdited: false,
        user: { id: "user-1", name: "Test User", image: null },
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    mockDb.comment.findMany.mockResolvedValue(comments)

    const request = createNextRequest("http://localhost:3000/api/comments?issueId=issue-1")
    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(comments)
  })
})

describe("POST /api/comments", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ body: "Nice", issueId: "issue-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when body or issueId missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ issueId: "issue-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 404 when issue not found", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ body: "Nice", issueId: "issue-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it("returns 403 when not a member", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(null)

    const request = createNextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ body: "Nice", issueId: "issue-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("creates a comment successfully", async () => {
    mockAuthenticated()
    mockDb.issue.findUnique.mockResolvedValue({
      id: "issue-1",
      project: { organizationId: "org-1" },
    } as any)
    mockDb.membership.findUnique.mockResolvedValue(createMembership())

    const created = {
      id: "comment-new",
      body: "Nice comment",
      issueId: "issue-1",
      userId: "user-1",
      parentId: null,
      isEdited: false,
      user: { id: "user-1", name: "Test User", image: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockDb.comment.create.mockResolvedValue(created)

    const request = createNextRequest("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({ body: "Nice comment", issueId: "issue-1" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(201)

    const body = await response.json()
    expect(body).toEqual(created)
    expect(mockDb.comment.create).toHaveBeenCalledWith({
      data: {
        body: "Nice comment",
        issueId: "issue-1",
        userId: "user-1",
        parentId: null,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
  })
})
