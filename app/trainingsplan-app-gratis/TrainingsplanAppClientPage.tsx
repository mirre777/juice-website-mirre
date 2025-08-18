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

  const heroProps = {
    title: "Kostenlose Fitness App für dein Training zuhause",
    subtitle: "Deine Workouts, dein Plan, kein Abo.",
    description: "Kostenlose Fitness App mit Übungen für jedes Level. Nutze die App online oder offline verfügbar.",
    rating: "5/5 von unseren Nutzern",
  }

  const featuresProps = {
    title: "Warum diese App?",
    features: [
      {
        title: "Kostenlos starten",
        description: "Kostenlose Fitness App mit Übungen für jedes Level",
      },
      {
        title: "Individueller Plan",
        description: "Trainingsplan App für Kraft, Ausdauer oder HIIT",
      },
      {
        title: "Online & Offline",
        description: "Nutze die App online oder als Fitness Online App offline verfügbar",
      },
      {
        title: "Transparent",
        description: "Keine Werbung, kein Abo, volle Kontrolle",
      },
    ],
    ctaData: {
      title: "Kostenlose Fitness App herunterladen",
      subtitle: "Hol dir die App und trainiere zuhause, ohne Abo und ohne Grenzen.",
      bulletPoints: ["Kostenlos starten, jederzeit erweiterbar", "Transparent: keine versteckten Kosten"],
    },
  }

  const faqProps = {
    title: "Häufig gestellte Fragen",
    faqs: [
      {
        question: "Ist die Fitness App wirklich kostenlos?",
        answer:
          "Ja, die Grundfunktionen der App sind komplett kostenlos. Du zahlst nur für Premium-Features oder Personal Trainer Sessions.",
      },
      {
        question: "Kann ich die App offline nutzen?",
        answer:
          "Ja, viele Workouts und Trainingspläne sind offline verfügbar, sobald sie einmal heruntergeladen wurden.",
      },
      {
        question: "Für welche Fitnesslevel ist die App geeignet?",
        answer:
          "Die App bietet Workouts für alle Level - von Anfänger bis Fortgeschrittene. Jeder Trainingsplan passt sich deinem Niveau an.",
      },
      {
        question: "Brauche ich Geräte für die Workouts?",
        answer:
          "Nein, viele Übungen können ohne Geräte durchgeführt werden. Es gibt aber auch Trainingspläne mit Equipment.",
      },
      {
        question: "Wie funktioniert das Training mit Personal Trainer?",
        answer:
          "Du kannst direkt in der App Personal Trainer Sessions buchen. Diese finden bei dir zuhause oder online statt.",
      },
      {
        question: "Ist die App auch für Laufen und Radfahren geeignet?",
        answer:
          "Ja, die App unterstützt verschiedene Sportarten inklusive Laufen, Radfahren und andere Ausdauersportarten.",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <ClientHeroSection {...heroProps} />
        <ClientFeaturesSection {...featuresProps} />
        <ClientFAQSection {...faqProps} />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
