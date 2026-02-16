"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LandingPageHeroSection } from "@/app/(landing-pages)/components/landing-page-hero-section"
import { LandingPageFeaturesSection } from "@/app/(landing-pages)/components/landing-page-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { useTheme } from "@/contexts/theme-context"

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Juice Best Free Workout App UK",
  description:
    "Best Free Workout App UK – Track, Plan and Get Stronger. Personal workout planner and fitness tracking.",
  url: "https://juice-website-mirre.vercel.app/best-free-workout-app-uk",
  applicationCategory: "HealthApplication",
  operatingSystem: ["iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
    description: "Free workout app with personal workout planner and progress tracking",
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

export default function BestFreeWorkoutAppClientPage() {
  const { setIsCoach } = useTheme()
  const heroData = {
    title: "Best Free Workout App UK – Track, Plan and Get Stronger",
    subtitle:
      "Looking for a way to train smarter without paying a subscription? Our free workout app helps you log your workouts, follow a personal workout planner, and stay motivated.",
    rating: "5/5 by our users",
    ctaText: "Download App for Free",
    ctaUrl: "/best-free-workout-app-uk",
  }

  const featuresData = {
    title: "Why use a workout app?",
    features: [
      {
        title: "Track Progress",
        description:
          "Monitor your fitness journey with detailed metrics and visualizations that show your improvement over time",
      },
      {
        title: "Personal Workout Planner",
        description:
          "Access your personalized workout plans and schedule anytime, anywhere with clear instructions for each exercise",
      },
      {
        title: "Free & Accessible",
        description: "Good workout apps free for beginners and pros - from bodyweight training to gym lifting",
      },
      {
        title: "Stay Motivated",
        description: "Best fitness planner app with community features to keep you consistent and motivated",
      },
    ],
    ctaData: {
      title: "Download the best free workout app",
      subtitle: "Get the app and start training at home, no subscription, no limits.",
      bulletPoints: ["Free to start, always expandable", "Transparent: no hidden costs"],
      ctaButtonText: "Download App for Free",
      ctaButtonUrl: "/best-free-workout-app-uk",
    },
  }

  const faqData = {
    title: "Frequently Asked Questions",
    faqs: [
      {
        question: "What is the best free workout app in the UK?",
        answer:
          "Our workout app stands out as the best free workout app in the UK because it combines comprehensive workout planning, progress tracking, and community motivation without any subscription fees or hidden costs.",
      },
      {
        question: "Is there a free gym workout planner app?",
        answer:
          "Yes! Our app includes a complete gym workout planner that helps you structure your routines, track your progress, and plan personalised workouts for strength training, cardio, and HIIT.",
      },
      {
        question: "Which workout app is best for strength training?",
        answer:
          "Our app excels at strength training with features to log sets, reps, and weights, analyse your data over time, and follow structured progression plans designed for building strength and muscle.",
      },
      {
        question: "Can I track my progress with a workout app?",
        answer:
          "Our app provides comprehensive progress tracking including workout history, strength gains, personal records, and detailed analytics to help you see your improvement over time.",
      },
      {
        question: "Do I need a subscription for the best workout app?",
        answer:
          "No! Our app is completely free to use. You get access to all workout planning, progress tracking, and community features without any subscription or payment required.",
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
        <LandingPageHeroSection {...heroData} />
        <LandingPageFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
