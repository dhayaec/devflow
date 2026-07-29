import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { rateLimit } from "@/lib/rate-limiter"

const authMiddleware = NextAuth(authConfig).auth as unknown as (req: NextRequest) => Promise<ReturnType<typeof NextAuth>["auth"]>

export default async function proxy(request: NextRequest) {
  const url = new URL(request.url)

  // Rate limit API routes
  if (url.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown"
    const key = `${ip}:${url.pathname}`

    const result = rateLimit(key, { maxRequests: 100, windowMs: 60000 })
    if (!result.allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      })
    }
  }

  return authMiddleware(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
