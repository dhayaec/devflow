import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address.
            Please click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or try signing up again.
        </CardContent>
      </Card>
    </div>
  )
}
