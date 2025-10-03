import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientLayoutWrapper } from "./client-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <ClientLayoutWrapper className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </ThemeProvider>
        </Suspense>
      </ClientLayoutWrapper>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
