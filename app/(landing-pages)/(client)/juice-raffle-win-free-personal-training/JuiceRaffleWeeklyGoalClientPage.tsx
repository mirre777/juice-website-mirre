// JuiceRaffleWeeklyGoalClientPage.tsx

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
  name: "Win Free Personal Training",
  description: "Win a free month of personal training — just by working out.",
  url: "https://juice.fitness/juice-raffle-win-free-personal-training",
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
    title: "Win Free Personal Training",
    subtitle:
      "Juice Raffle: Win a free month of personal training — just by working out.",
    rating: "5/5 by our moms (they have great form)",
    ctaText: "Open the Juice App",
    ctaUrl: "/download-juice-app",
  }

  const featuresData = {
    title: "How it works",
    features: [
      {
        title: "1. Download the free app",
        description: "Get the Juice Fitness app on iOS or Android.",
      },
      {
        title: "2. Set your weekly goal",
        description: "Minimum: 3 sessions per week. Be ambitious.",
      },
      {
        title: "3. Log every workout",
        description: "Each workout counts — just make it at least 30 minutes.",
      },
      {
        title: "Stay consistent for 4 weeks",
        description: "Hit your goal for 4 weeks in a row and you’re in the draw.",
      },
    ],
    ctaData: {
      title: "Ready to start your streak?",
      subtitle: "Download the app, set your goal, and log your workouts for 4 weeks.",
      bulletPoints: ["No hidden costs", "Entries close Dec 31"],
      ctaButtonText: "Download the app",
      ctaButtonUrl: "/download-juice-app",
    },
  }

  const faqData = {
    title: "FAQ",
    faqs: [
      {
        question: "What is the Juice Raffle?",
        answer:
          "We're giving away a month of free personal training among all those who hit their workout sessiongoal 4 weeks in a row.",
      },
      {
        question: "What do I win?",
        answer:
          "You’ll receive one month of personal training (4 sessions) with a certified Juice trainer.",
      },
      {
        question: "How do I enter?",
        answer:
          "Download the free Juice Fitness app, set a weekly goal (of at least 3 workout sessions) and log your workouts. Your entry is automatic when the goal is met 4 weeks in a row.",
      },
      {
        question: "What counts toward the goal?",
        answer:
          "Completed workouts tracked in the app. A workout must be at least 30 minutes long to count.",
      },
      {
        question: "Is it really free?",
        answer: "Yes. The Juice Raffle is 100% free: No hidden fees, no subscriptions. Just train and log your sessions.",
      },
      {
        question: "How are winners announced?",
        answer: "We’ll announce the winner on our socials and contact them directly via email.",
      },
      {
        question: "What are the terms and conditions?",
        answer:
          "Minimum of 3 sessions per week for 4 weeks needed to enter the raffle. All entries are processed manually by the Juice team. Participants agree to be contacted by the Juice team for the purpose of the raffle. End of raffle is 31st of December 2025."
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
