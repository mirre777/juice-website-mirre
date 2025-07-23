import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juice - Personal Training Platform",
  description: "Connect with certified personal trainers and transform your fitness journey",
  keywords: ["personal training", "fitness", "health", "workout", "trainer"],
  authors: [{ name: "Juice Team" }],
  openGraph: {
    title: "Juice - Personal Training Platform",
    description: "Connect with certified personal trainers and transform your fitness journey",
    url: "https://juice-website.vercel.app",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-og-image.png",
        width: 1200,
        height: 630,
        alt: "Juice - Personal Training Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice - Personal Training Platform",
    description: "Connect with certified personal trainers and transform your fitness journey",
    images: ["/images/juice-og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
