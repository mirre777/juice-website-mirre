"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { PaymentModal } from "@/components/payment/payment-modal"
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
    subtitle:
      "Build strength with simple dumbbell workouts. No fluff. Just fast, effective training you can use with clients anywhere. Perfect for online or gym PTs.",
    rating: "4.8/5 by 250+ users",
    ctaText: "Get Program for €2",
    customCTA: (
      <PaymentModal
        triggerText="Get Program for €2"
        amount="2.00"
        description="Push/Pull/Legs Dumbbell Program"
        onPaymentComplete={() => {
          console.log("Dumbbell workout program purchased!")
        }}
      />
    ),
  }

  const featuresData = {
    title: "Why choose our Push/Pull/Legs dumbbell program?",
    features: [
      {
        title: "Perfect for Travel & Hotel Gyms",
        description: "Ideal routine when you're traveling or at a hotel gym with limited equipment.",
      },
      {
        title: "Simple & Effective",
        description:
          "3-day split, 3 sets per exercise, clear rep ranges. No confusion, just results with minimal equipment",
      },
    ],
    ctaData: {
      title: "Or just download the app",
      subtitle: "Start your Push/Pull/Legs transformation",
      bulletPoints: ["Track your workouts", "Exercise library & videos", "Progress tracking"],
      customCTA: (
        <PaymentModal
          triggerText="Get Program for €2"
          amount="2.00"
          description="Push/Pull/Legs Dumbbell Program"
          onPaymentComplete={() => {
            console.log("Dumbbell workout program purchased!")
          }}
        />
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
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
