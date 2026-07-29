"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function registerUser(formData: z.infer<typeof registerSchema>) {
  const validated = registerSchema.safeParse(formData)
  if (!validated.success) {
    return { error: validated.error.issues[0].message }
  }

  const { name, email, password } = validated.data

  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: "A user with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong during sign in" }
    }
    throw error
  }

  return { success: true }
}

export async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}

export async function signInWithOAuth(provider: "google" | "github") {
  await signIn(provider, { redirectTo: "/" })
}

export async function signInWithMagicLink(email: string) {
  await signIn("resend", { email, redirectTo: "/" })
}
