import { Suspense } from "react"
import { ResetPasswordForm } from "./reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
