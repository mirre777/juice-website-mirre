"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"

// Structured Data for the page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Juice Gratis Workout App",
  description:
    "Gratis workout app voor training met personal trainer aan huis of zelfstandig trainen. Geen sportschool nodig.",
  url: "https://juice-website-mirre.vercel.app/gratis-workout-app-met-trainer",
  applicationCategory: "HealthApplication",
  operatingSystem: ["iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Gratis workout app, betaal alleen voor personal trainer sessies",
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

export default function GratisWorkoutAppClientPage() {
  // <CHANGE> Added theme context to automatically set client mode
  const { setIsCoach } = useTheme()

  // <CHANGE> Automatically set to client mode when page loads
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
