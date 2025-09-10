"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"

interface WorkoutProgramData {
  title: string
  subtitle: string
  rating: string
  ctaText: string
  features: {
    title: string
    description: string
  }[]
  ctaData: {
    title: string
    subtitle: string
    bulletPoints: string[]
  }
  faqs: {
    question: string
    answer: string
  }[]
  structuredData: any
}

interface WorkoutProgramClientPageProps {
  data: WorkoutProgramData
}

export function WorkoutProgramClientPage({ data }: WorkoutProgramClientPageProps) {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: data.title,
    subtitle: data.subtitle,
    rating: data.rating,
    ctaText: data.ctaText,
  }

  const featuresData = {
    title: "Why choose this workout program?",
    features: data.features,
    ctaData: data.ctaData,
  }

  const faqData = {
    title: "Frequently Asked Questions",
    faqs: data.faqs,
  }

  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data.structuredData) }} />
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <ClientHeroSection {...heroData} />
        <ClientFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
