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
  name: "Juice Raffle – Win a Free Form Check",
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
      "Stay consistent with your workouts for one week in the Juice app. Complete your target and automatically enter our raffle.",
    rating: "5/5 by our moms",
    ctaText: "Open the Juice App",
    ctaUrl: "/download-juice-app",
  }

  const featuresData = {
    title: "How it works",
    features: [
      {
        title: "1. Set your weekly goal",
        description: "Choose workouts or activity you want to hit this week - minimum 3 sessions",
      },
      {
        title: "2. Log workouts",
        description: "Use the Juice app to log sessions and see streaks.",
      },
      {
        title: "3. Hit your goal",
        description: "Hit the goal (min. 3) and you're automatically entered in the raffle.",
      },
      {
        title: "1000. Fair & simple",
        description: "No fees. Just train, log it, and stay consistent.",
      },
    ],
    ctaData: {
      title: "Join the weekly raffle",
      subtitle: "Open the app, set a goal (minimum 3 sessions), and start your streak today.",
      bulletPoints: ["Consistency-based entry", "No purchase necessary"],
      ctaButtonText: "Open the Juice App",
      ctaButtonUrl: "/download-juice-app",
    },
  }

  const faqData = {
    title: "FAQ",
    faqs: [
      {
        question: "What is the Juice Weekly-Goal Challenge?",
        answer:
          "We're giving away a raffle prize among anyone who has set their weekly workout goal and achieved it at the end of that week (min. 3 sessions required)ions) in the Juice app and complete it.",
      },
      {
        question: "How do I enter?",
        answer:
          "Set a weekly goal (of at least 3 workout sessions) in the Juice app and complete it. Your entry is automatic when the goal is met.",
      },
      {
        question: "What counts toward the goal?",
        answer:
          "Completed workouts tracked in the app. See the challenge rules in-app for details.",
      },
      {
        question: "Do I need to pay anything?",
        answer: "No. Participation is free. Just train and log your sessions.",
      },
      {
        question: "Where do I see winners?",
        answer: "We announce them in the app and via our socials/newsletter.",
      },
      {
        question: "Terms & Conditions",
        answer:
          "Minimum of 3 sessions needed to enter the raffle. All entries are processed manually by the Juice team. The winner will be announced via our socials. End of raffle is 31st of October 2025."
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
