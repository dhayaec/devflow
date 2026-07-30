/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "@/app/api/auth/password/route"
import { mockDb } from "@/__tests__/setup"
import {
  mockAuthenticated,
  mockUnauthenticated,
  createNextRequest,
} from "@/__tests__/helpers"
import bcrypt from "bcryptjs"

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
  compare: vi.fn(),
  hash: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("POST /api/auth/password", () => {
  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated()
    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpassword123" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("returns 400 when passwords missing", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "old" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 400 when new password too short", async () => {
    mockAuthenticated()
    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "old", newPassword: "short" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 400 when user has no password set", async () => {
    mockAuthenticated()
    mockDb.user.findUnique.mockResolvedValue({ id: "user-1", password: null } as any)

    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpassword123" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("returns 403 when current password is incorrect", async () => {
    mockAuthenticated()
    mockDb.user.findUnique.mockResolvedValue({ id: "user-1", password: "hashed-old" } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "wrong", newPassword: "newpassword123" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("changes password successfully", async () => {
    mockAuthenticated()
    mockDb.user.findUnique.mockResolvedValue({ id: "user-1", password: "hashed-old" } as any)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(bcrypt.hash).mockResolvedValue("new-hashed" as never)
    mockDb.user.update.mockResolvedValue({} as any)

    const request = createNextRequest("http://localhost:3000/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpassword123" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 12)
  })
})
