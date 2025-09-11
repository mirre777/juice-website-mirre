"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, initGA, getAnalyticsConsent } from "@/lib/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize GA on mount if consent exists
    if (getAnalyticsConsent()) {
      initGA()
    }
  }, [])

  useEffect(() => {
    // Track page views on route changes
    if (getAnalyticsConsent()) {
      trackPageView(window.location.href)
    }
  }, [pathname])

  return <>{children}</>
}
