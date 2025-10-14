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
  "@type": "WebPage",
  name: "Juice Raffle – Hit Weekly Goal",
  description: "Hit your weekly goal in the Juice app and enter our raffle. Stay consistent and win.",
  url: "https://juice.fitness/juice-raffle-hit-weekly-goal",
  publisher: {
    "@type": "Organization",
    name: "Juice",
    logo: {
      "@type": "ImageObject",
      url: "https://juice.fitness/images/juiceNewLogoPrime.png",
    },
  },
}

export default function JuiceRaffleWeeklyGoalClientPage() {
  const { setIsCoach } = useTheme()
  const heroData = {
    title: "Hit your weekly goal — enter the Juice raffle",
    subtitle:
      "Stay consistent for one week in the Juice app. Complete your target and automatically enter our raffle.",
    rating: "Weekly challenge",
    ctaText: "Open the Juice App",
    ctaUrl: "/download-juice-app",
  }

  const featuresData = {
    title: "How it works",
    features: [
      {
        title: "Set your goal",
        description: "Choose workouts or activity you want to hit this week.",
      },
      {
        title: "Track consistency",
        description: "Use the Juice app to log sessions and see streaks.",
      },
      {
        title: "Enter to win",
        description: "Hit the goal and you're automatically entered in the raffle.",
      },
      {
        title: "Fair & simple",
        description: "No fees. Just train, log it, and stay consistent.",
      },
    ],
    ctaData: {
      title: "Join the weekly raffle",
      subtitle: "Open the app, set a goal, and start your streak today.",
      bulletPoints: ["Consistency-based entry", "No purchase necessary"],
      ctaButtonText: "Open the Juice App",
      ctaButtonUrl: "/download-juice-app",
    },
  }

  const faqData = {
    title: "FAQ",
    faqs: [
      {
        question: "How do I enter?",
        answer:
          "Set a weekly goal in the Juice app and complete it. Your entry is automatic when the goal is met.",
      },
      {
        question: "What counts toward the goal?",
        answer:
          "Logged workouts and activities tracked in the app. See the challenge rules in-app for details.",
      },
      {
        question: "Do I need to pay anything?",
        answer: "No. Participation is free. Just train and log your sessions.",
      },
      {
        question: "Where do I see winners?",
        answer: "We announce them in the app and via our socials/newsletter.",
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
