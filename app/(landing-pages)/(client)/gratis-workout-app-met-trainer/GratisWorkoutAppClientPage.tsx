"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LandingPageHeroSection } from "@/app/(landing-pages)/components/landing-page-hero-section"
import { LandingPageFeaturesSection } from "@/app/(landing-pages)/components/landing-page-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"
import { trackPageView } from "@/lib/analytics"

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
  const { setIsCoach } = useTheme()

  useEffect(() => {
    setIsCoach(false)
    trackPageView(window.location.href, "Gratis Workout App met Trainer - Juice Fitness")
  }, [setIsCoach])

  const heroProps = {
    title: "Persoonlijke fitness app zonder gedoe",
    subtitle: "Train met een personal trainer of zelfstandig. Waar en wanneer jij wil.",
    description:
      "Gratis workout app voor training met personal trainer aan huis of zelfstandig trainen. Geen sportschool nodig.",
    rating: "5/5 door onze moeders",
    ctaText: "Download App Gratis",
    ctaUrl: "/gratis-workout-app-met-trainer",
  }

  const featuresProps = {
    title: "Waarom deze app?",
    features: [
      {
        title: "Gratis beginnen",
        description: "Gratis workout app, betaal alleen voor personal trainer sessies",
      },
      {
        title: "Persoonlijk plan",
        description: "Trainingsschema aangepast aan jouw doelen en niveau",
      },
      {
        title: "Online & Offline",
        description: "Train waar je wil, wanneer je wil, met of zonder internet",
      },
      {
        title: "Transparant",
        description: "Geen verborgen kosten, geen verplichtingen, volledige controle",
      },
    ],
    ctaData: {
      title: "Download gratis workout app",
      subtitle: "Haal de app en train thuis, zonder abonnement en zonder grenzen.",
      bulletPoints: ["Gratis te starten, altijd uit te breiden", "Transparant: geen verborgen kosten"],
      ctaButtonText: "Download App Gratis",
      ctaButtonUrl: "/gratis-workout-app-met-trainer",
    },
  }

  const faqProps = {
    title: "Veelgestelde vragen",
    faqs: [
      {
        question: "Is de workout app echt gratis?",
        answer: "Ja, de basis app is volledig gratis. Je betaalt alleen voor personal trainer sessies als je die wil.",
      },
      {
        question: "Kan ik offline trainen?",
        answer: "Ja, veel workouts zijn offline beschikbaar zodra je ze hebt gedownload.",
      },
      {
        question: "Voor welk niveau is de app geschikt?",
        answer:
          "De app is geschikt voor alle niveaus, van beginner tot gevorderd. Elk programma past zich aan jouw niveau aan.",
      },
      {
        question: "Heb ik apparatuur nodig?",
        answer: "Nee, veel oefeningen kunnen zonder apparatuur. Er zijn ook programma's met equipment beschikbaar.",
      },
      {
        question: "Hoe werkt training met een personal trainer?",
        answer: "Je kunt direct in de app personal trainer sessies boeken. Deze vinden plaats bij jou thuis of online.",
      },
      {
        question: "Ondersteunt de app ook hardlopen en fietsen?",
        answer:
          "Ja, de app ondersteunt verschillende sporten waaronder hardlopen, fietsen en andere cardio activiteiten.",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <LandingPageHeroSection {...heroProps} />
        <LandingPageFeaturesSection {...featuresProps} />
        <ClientFAQSection {...faqProps} />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
