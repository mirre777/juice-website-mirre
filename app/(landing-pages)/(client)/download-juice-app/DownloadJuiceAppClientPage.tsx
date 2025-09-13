"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DownloadHeroSection } from "@/components/download-hero-section"
import { AppDownloadSection } from "@/components/app-download-section"
import { trackPageView } from "@/lib/analytics"

export default function DownloadJuiceAppClientPage() {
  useEffect(() => {
    trackPageView(window.location.href, "Download Juice App - Free Fitness Tracking")
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <DownloadHeroSection />
      <AppDownloadSection />
      <Footer />
    </main>
  )
}
