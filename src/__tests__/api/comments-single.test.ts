/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { PATCH, DELETE } from "@/app/api/comments/[commentId]/route"
import { mockDb } from "@/__tests__/setup"
import {
  mockAuthenticated,
  mockUnauthenticated,
  createNextRequest,
  getResponseJson,
} from "@/__tests__/helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

function makeParams(commentId: string) {
  return { params: Promise.resolve({ commentId }) }
}

describe("PATCH /api/comments/[commentId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ body: "Edited" }) }),
      makeParams("comment-1"),
    )
    expect(response.status).toBe(401)
  })

  it("returns 404 when comment not found", async () => {
    mockAuthenticated()
    mockDb.comment.findUnique.mockResolvedValue(null)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ body: "Edited" }) }),
      makeParams("comment-1"),
    )
    expect(response.status).toBe(404)
  })

  it("returns 403 when editing another user's comment", async () => {
    mockAuthenticated({ id: "user-2" })
    mockDb.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      userId: "user-1",
      issue: { project: { organizationId: "org-1" } },
    } as any)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ body: "Edited" }) }),
      makeParams("comment-1"),
    )
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body).toEqual({ error: "Cannot edit another user's comment" })
  })

  it("updates own comment successfully", async () => {
    mockAuthenticated()
    mockDb.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      userId: "user-1",
      issue: { project: { organizationId: "org-1" } },
    } as any)

    const updated = {
      id: "comment-1",
      body: "Edited text",
      isEdited: true,
      user: { id: "user-1", name: "Test User", image: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockDb.comment.update.mockResolvedValue(updated)

    const response = await PATCH(
      createNextRequest("http://localhost:3000", { method: "PATCH", body: JSON.stringify({ body: "Edited text" }) }),
      makeParams("comment-1"),
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(updated)
    expect(mockDb.comment.update).toHaveBeenCalledWith({
      where: { id: "comment-1" },
      data: { body: "Edited text", isEdited: true },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
  })
})

describe("DELETE /api/comments/[commentId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("comment-1"))
    expect(response.status).toBe(401)
  })

  it("returns 404 when comment not found", async () => {
    mockAuthenticated()
    mockDb.comment.findUnique.mockResolvedValue(null)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("comment-1"))
    expect(response.status).toBe(404)
  })

  it("returns 403 when deleting another user's comment", async () => {
    mockAuthenticated({ id: "user-2" })
    mockDb.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      userId: "user-1",
      issue: { project: { organizationId: "org-1" } },
    } as any)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("comment-1"))
    expect(response.status).toBe(403)
  })

  it("deletes own comment successfully", async () => {
    mockAuthenticated()
    mockDb.comment.findUnique.mockResolvedValue({
      id: "comment-1",
      userId: "user-1",
      issue: { project: { organizationId: "org-1" } },
    } as any)
    mockDb.comment.delete.mockResolvedValue({} as any)

    const response = await DELETE(createNextRequest("http://localhost:3000", { method: "DELETE" }), makeParams("comment-1"))
    expect(response.status).toBe(200)
    const body = await getResponseJson(response)
    expect(body).toEqual({ success: true })
  })
})
