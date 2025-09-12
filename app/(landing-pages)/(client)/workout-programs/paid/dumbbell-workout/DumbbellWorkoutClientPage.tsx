"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { PaymentModal } from "@/components/payment/payment-modal"
import { RelatedWorkoutPrograms } from "@/app/(landing-pages)/(client)/workout-programs/components/related-workout-programs"
import { useTheme } from "@/contexts/theme-context"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Dumbbell Workout Program",
  description:
    "Push/Pull/Legs dumbbell workout program for building muscle and strength at home. Structured 3-day training split with expert guidance.",
  url: "https://juice-website-mirre.vercel.app/workout-programs/paid/dumbbell-workout",
  category: "Fitness Program",
  offers: {
    "@type": "Offer",
    price: "2.00",
    priceCurrency: "EUR",
    description: "Complete Push/Pull/Legs dumbbell workout program with structured training plans",
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
    title: (
      <>
        Dumbbell Workouts with <br />
        Push-Pull-Legs
      </>
    ),
    subtitle: "Build strength with simple dumbbell workouts. No fluff. Just fast, effective training.",
    rating: "4.8/5 by 250+ users",
    ctaText: "Get Program for €2",
    customCTA: (
      <PaymentModal
        amount="2"
        description="Push/Pull/Legs Dumbbell Program"
        onPaymentComplete={() => {
          console.log("Dumbbell workout program purchased!")
        }}
      >
        <button className="bg-[#D2FF28] hover:bg-[#c4f01f] text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2">
          Get Program for €2
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </PaymentModal>
    ),
  }

  const featuresData = {
    title: "Why choose our Push/Pull/Legs dumbbell program?",
    features: [
      {
        icon: "💪",
        title: "Perfect for Travel & Hotel Gyms",
        description: "Ideal routine when you're traveling with limited equipment.",
      },
      {
        icon: "⚡",
        title: "Simple & Effective",
        description:
          "3-day split, 3 sets per exercise, clear rep ranges. No confusion, just results with minimal equipment",
      },
    ],
    ctaData: {
      title: "Or Just Download The App",
      subtitle: "Start your fitness transformation",
      bulletPoints: ["Track your workouts", "Exercise library & videos", "Progress tracking"],
      ctaButtonText: "Get Program for €2",
      ctaButtonStyle: "black" as const,
      customCTA: (
        <PaymentModal
          amount="2"
          description="Push/Pull/Legs Dumbbell Program"
          onPaymentComplete={() => {
            console.log("Dumbbell workout program purchased!")
          }}
        >
          <button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2">
            Get Program for €2
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </PaymentModal>
      ),
    },
  }

  const faqData = {
    title: "Frequently Asked Questions",
    faqs: [
      {
        question: "What's included in the Push/Pull/Legs program?",
        answer:
          "You get a complete 3-day workout split: Push day (chest, shoulders, triceps), Pull day (back, biceps), and Legs day (quads, hamstrings, calves). Each workout includes specific exercises, sets, and rep ranges.",
      },
      {
        question: "What equipment do I need?",
        answer:
          "Uhhh... a set of dumbbells? The program is designed to be equipment-minimal while maximizing results. Adjustable dumbbells work best for progression.",
      },
      {
        question: "How often should I do these workouts?",
        answer:
          "Follow the 3-day split: Push, Pull, Legs, then rest or repeat. You can do this 3-6 times per week depending on your recovery and goals. Research shows 10-16 sets per muscle group per week is optimal for muscle growth, which this program delivers perfectly.",
      },
      {
        question: "Is this suitable for beginners?",
        answer:
          "Yes! Start with lighter weights and focus on form. The rep ranges (8-12 for upper body, 12-20 for abs/calves) allow for progression at any level.",
      },
      {
        question: "Why only €2?",
        answer:
          "We believe effective training shouldn't be expensive. This program gives you everything you need to build muscle with dumbbells at an accessible price.",
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

        <section className="container mx-auto px-4 md:px-6 py-16">
          <RelatedWorkoutPrograms currentSlug="dumbbell-workout" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
