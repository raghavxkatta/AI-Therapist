import type React from "react"
import type { Metadata } from "next"
import '@fontsource/geist-sans'; // Defaults to weight 400.
import '@fontsource/geist-mono'; // Defaults to weight 400.
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MindfulAI - AI-Powered Therapy & Mental Health",
  description: "Your personal AI therapist for mental health support, mood tracking, and therapeutic activities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        style={{ fontFamily: "'Geist Sans', 'Geist Mono', sans-serif" }}
      >
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
