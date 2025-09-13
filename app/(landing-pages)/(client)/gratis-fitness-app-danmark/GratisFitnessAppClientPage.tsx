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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Juice Gratis Fitness App Danmark",
  description: "Gratis fitness app i Danmark – Træn når og hvor du vil. Træningsprogrammer, tracking og community.",
  url: "https://juice-website-mirre.vercel.app/gratis-fitness-app-danmark",
  applicationCategory: "HealthApplication",
  operatingSystem: ["iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "DKK",
    description: "Gratis fitness app med træningsprogrammer til alle niveauer",
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

export default function GratisFitnessAppClientPage() {
  const { setIsCoach } = useTheme()
  const heroData = {
    title: "Gratis fitness app i Danmark – Træn når og hvor du vil",
    subtitle:
      "Vil du i form uden at betale abonnement? Vores gratis fitness app giver dig træningsprogrammer, tracking og mulighed for at dele din træning med venner. Perfekt til både hjemmetræning og fitnesscenter.",
    rating: "5/5 af vores brugere",
    ctaText: "Download App Gratis",
    ctaUrl: "/gratis-fitness-app-danmark",
  }

  const featuresData = {
    title: "Hvorfor denne app?",
    features: [
      {
        title: "Gratis at starte",
        description: "Gratis fitness app med træningsprogrammer til alle niveauer",
      },
      {
        title: "Personligt program",
        description: "Træningsprogram app til styrke, cardio eller HIIT",
      },
      {
        title: "Online & Offline",
        description: "Brug appen online eller offline – perfekt til alle situationer",
      },
      {
        title: "Community",
        description: "Del din træning med venner og bliv motiveret af fællesskabet",
      },
    ],
    ctaData: {
      title: "Download gratis fitness app",
      subtitle: "Hent appen og træn hjemme, uden abonnement og uden grænser.",
      bulletPoints: ["Gratis at starte, kan altid udvides", "Transparent: ingen skjulte omkostninger"],
      ctaButtonText: "Download App Gratis",
      ctaButtonUrl: "/gratis-fitness-app-danmark",
    },
  }

  const faqData = {
    title: "Ofte stillede spørgsmål",
    faqs: [
      {
        question: "Er der en gratis fitness app i Danmark?",
        answer:
          "Ja! Vores fitness app er helt gratis at bruge i Danmark. Du får adgang til træningsprogrammer, tracking og community-funktioner uden abonnement eller skjulte omkostninger.",
      },
      {
        question: "Hvad er den bedste træningsprogram app?",
        answer:
          "Den bedste træningsprogram app giver dig fleksibilitet til at lave dine egne programmer eller følge færdige planer. Vores app tilbyder både styrke-, cardio- og HIIT-programmer tilpasset dit niveau.",
      },
      {
        question: "Hvilken løbe app er bedst til tracking?",
        answer:
          "En god løbe app skal have GPS tracking, rute-lagring og mulighed for at dele resultater. Vores app fungerer som både løbe app og cykel app med præcis tracking af dine aktiviteter.",
      },
      {
        question: "Kan jeg bruge appen offline?",
        answer:
          "Ja, du kan bruge vores fitness app offline. Download dine træningsprogrammer og brug dem hvor som helst – også uden internetforbindelse.",
      },
      {
        question: "Koster booking via fitness app ekstra?",
        answer:
          "Nej, booking-funktionen er inkluderet gratis. Du kan booke træning, deltage i challenges og måle dine resultater uden ekstra omkostninger.",
      },
    ],
  }

  useEffect(() => {
    setIsCoach(false)
    trackPageView(window.location.href, "Gratis Fitness App Danmark - Juice Fitness")
  }, [setIsCoach])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <LandingPageHeroSection {...heroData} />
        <LandingPageFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
