import { describe, it, expect, beforeEach } from "vitest"
import { rateLimit, rateLimitMiddleware } from "@/lib/rate-limiter"

describe("rateLimit", () => {
  beforeEach(() => {
    // isolate tests by using unique keys
  })

  it("allows first request", () => {
    const result = rateLimit("test-1", { maxRequests: 5, windowMs: 60000 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })

  it("allows requests within limit", () => {
    const key = "test-2"
    rateLimit(key, { maxRequests: 3, windowMs: 60000 })
    rateLimit(key, { maxRequests: 3, windowMs: 60000 })
    const result = rateLimit(key, { maxRequests: 3, windowMs: 60000 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it("blocks requests exceeding limit", () => {
    const key = "test-3"
    rateLimit(key, { maxRequests: 2, windowMs: 60000 })
    rateLimit(key, { maxRequests: 2, windowMs: 60000 })
    const result = rateLimit(key, { maxRequests: 2, windowMs: 60000 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("uses default config when not provided", () => {
    const key = "test-4"
    const result = rateLimit(key)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(59)
  })

  it("resets window after expiry", async () => {
    const key = "test-5"
    rateLimit(key, { maxRequests: 1, windowMs: 50 })
    rateLimit(key, { maxRequests: 1, windowMs: 50 })
    const blocked = rateLimit(key, { maxRequests: 1, windowMs: 50 })
    expect(blocked.allowed).toBe(false)

    await new Promise((r) => setTimeout(r, 60))

    const result = rateLimit(key, { maxRequests: 1, windowMs: 50 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0)
  }, 10000)
})

describe("rateLimitMiddleware", () => {
  it("returns a middleware function", () => {
    const middleware = rateLimitMiddleware(10, 30000)
    expect(typeof middleware).toBe("function")
  })

  it("rate limits through middleware", () => {
    const check = rateLimitMiddleware(1, 60000)
    const first = check("mw-1")
    expect(first.allowed).toBe(true)
    const second = check("mw-1")
    expect(second.allowed).toBe(false)
  })
})
