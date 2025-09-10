"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Dumbbell Workout Program",
  description:
    "Comprehensive dumbbell workout program for building muscle and strength at home. Structured training plans with expert guidance.",
  url: "https://juice-website-mirre.vercel.app/workout-programs/paid/dumbbell-workout",
  category: "Fitness Program",
  offers: {
    "@type": "Offer",
    price: "29.99",
    priceCurrency: "GBP",
    description: "Complete dumbbell workout program with structured training plans and progress tracking",
    availability: "https://schema.org/InStock",
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
    ratingValue: "4.8",
    ratingCount: "250",
  },
}

export default function DumbbellWorkoutClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: "Dumbbell Workout Program – Build Muscle & Strength at Home",
    subtitle:
      "Transform your physique with our comprehensive dumbbell workout program. Build muscle, increase strength, and get fit at home with structured training plans and expert guidance.",
    rating: "4.8/5 by 250+ users",
    ctaText: "Get Dumbbell Workout Program",
  }

  const featuresData = {
    title: "Why choose our dumbbell workout program?",
    features: [
      {
        title: "Complete Muscle Building",
        description:
          "Full-body dumbbell workouts targeting all major muscle groups for balanced strength and muscle development",
      },
      {
        title: "Progressive Training Plans",
        description:
          "Structured 12-week program with progressive overload principles to maximize muscle growth and strength gains",
      },
      {
        title: "Home Gym Friendly",
        description: "Designed specifically for home workouts - all you need is a set of dumbbells to get started",
      },
      {
        title: "Expert Guidance",
        description: "Professional coaching cues, form tips, and workout modifications for all fitness levels",
      },
    ],
    ctaData: {
      title: "Start your dumbbell transformation",
      subtitle: "Get instant access to the complete program and start building muscle today.",
      bulletPoints: ["12-week structured program", "Video demonstrations included", "Progress tracking tools"],
    },
  }

  const faqData = {
    title: "Frequently Asked Questions",
    faqs: [
      {
        question: "What equipment do I need for this dumbbell workout program?",
        answer:
          "You only need a set of adjustable dumbbells or multiple pairs of fixed-weight dumbbells. The program is designed to be equipment-minimal while maximizing results.",
      },
      {
        question: "Is this program suitable for beginners?",
        answer:
          "Yes! The program includes modifications for all fitness levels. Beginners can start with lighter weights and progress gradually, while advanced users can challenge themselves with heavier loads.",
      },
      {
        question: "How long are the workouts?",
        answer:
          "Each workout session is designed to be 45-60 minutes, including warm-up and cool-down. The program includes 4-5 workouts per week for optimal results.",
      },
      {
        question: "Can I build significant muscle with just dumbbells?",
        answer:
          "Dumbbells are incredibly effective for muscle building. This program uses proven techniques like progressive overload, time under tension, and compound movements to maximize muscle growth.",
      },
      {
        question: "What's included in the program?",
        answer:
          "You get a complete 12-week training plan, exercise video demonstrations, nutrition guidelines, progress tracking sheets, and ongoing support through our community.",
      },
    ],
  }

  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
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
