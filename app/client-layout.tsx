"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get current pathname to conditionally style body
  const pathname = usePathname()
  const isClientsRoute = pathname?.startsWith("/clients")

  return (
    <div className={`${inter.className} ${isClientsRoute ? "bg-black text-white" : "bg-background"}`}>{children}</div>
  )
}
