import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juice - Fitness Tracking & Coaching Platform | Best Online Personal Trainer",
  description:
    "Connect with coaches, share workouts, and transform your fitness journey with Juice. The best coaching app for personal trainers with workout builder, client management, and fitness software to grow your personal training business.",
  keywords:
    "best online personal trainer, personal trainer website, coaching app for personal trainers, workout builder app, personal training software, fitness app for trainers, workout planner, online personal trainer app, personal trainer business tips, fitness coaching app",
  generator: "v0.dev",
  openGraph: {
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Fitness App - Simple Workout Logging",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
