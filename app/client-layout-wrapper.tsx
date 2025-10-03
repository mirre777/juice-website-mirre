"use client"

import { usePathname } from "next/navigation"
import type React from "react"

export function ClientLayoutWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const isClientsRoute = pathname?.startsWith("/clients")

  return <body className={`${className} ${isClientsRoute ? "bg-black text-white" : "bg-background"}`}>{children}</body>
}
