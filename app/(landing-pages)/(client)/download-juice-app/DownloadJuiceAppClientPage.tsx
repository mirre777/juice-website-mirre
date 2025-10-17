"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { DownloadHeroSection } from "@/components/download-hero-section"
import { AppDownloadSection } from "@/components/app-download-section"

export default function DownloadJuiceAppClientPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <DownloadHeroSection />
      <AppDownloadSection />
      <Footer />
      <FloatingDownloadCTA />
    </main>
  )
}
