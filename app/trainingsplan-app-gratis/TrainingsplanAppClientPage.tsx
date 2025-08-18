"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"

// Structured Data for the German page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Juice Kostenlose Fitness App",
  description: "Kostenlose Fitness App für dein Training zuhause. Deine Workouts, dein Plan, kein Abo.",
  url: "https://juice-website-mirre.vercel.app/trainingsplan-app-gratis",
  applicationCategory: "HealthApplication",
  operatingSystem: ["iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Kostenlose Fitness App mit Übungen für jedes Level",
  },
  publisher: {
    "@type": "Organization",
    name: "Juice",
    logo: {
      "@type": "ImageObject",
      url: "https://juice-website-mirre.vercel.app/images/juiceNewLogoPrime.png",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "100",
  },
}

export default function TrainingsplanAppClientPage() {
  const { setIsCoach } = useTheme()

  // Automatically set to client mode when page loads
  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <ClientHeroSection />
        <ClientFeaturesSection />
        <ClientFAQSection />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
