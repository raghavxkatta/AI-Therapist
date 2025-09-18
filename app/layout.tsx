import type React from "react"
import type { Metadata } from "next"
import "@fontsource/geist-sans"
import "@fontsource/geist-mono"

import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"

import { WithSidebar } from "@/components/layout/with-sidebar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MindfulAI - AI-Powered Therapy & Mental Health",
  description: "Your personal AI therapist for mental health support, mood tracking, and therapeutic activities",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <WithSidebar>{children}</WithSidebar>
        </ThemeProvider>

        {/* The Suspense component can be used for streaming UI, but it's not strictly necessary here. It doesn't cause any harm. */}
        <Suspense fallback={null} />
        <Analytics />
      </body>
    </html>
  );
}