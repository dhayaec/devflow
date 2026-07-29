import { redirect } from "next/navigation"
import { auth } from "@/auth"

interface AuthGuardProps {
  children: React.ReactNode
  required?: boolean
}

export async function AuthGuard({ children, required = true }: AuthGuardProps) {
  const session = await auth()

  if (required && !session?.user) {
    redirect("/login")
  }

  return <>{children}</>
}
