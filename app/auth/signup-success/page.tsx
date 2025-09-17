import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">MindfulAI</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link to complete your registration</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in and start your mental wellness journey.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                try signing up again
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
