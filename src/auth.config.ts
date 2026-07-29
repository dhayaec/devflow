import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAuthPage = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/forgot-password") ||
        nextUrl.pathname.startsWith("/reset-password")
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/")

      if (isOnAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
        return true
      }

      if (isOnDashboard && !isLoggedIn) {
        return false
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
