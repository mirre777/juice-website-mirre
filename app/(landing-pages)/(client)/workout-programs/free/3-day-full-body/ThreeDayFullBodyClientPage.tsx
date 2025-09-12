"use client"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/app/(landing-pages)/(client)/workout-programs/client-hero-section"
import { ClientFeaturesSection } from "@/app/(landing-pages)/(client)/workout-programs/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { RelatedWorkoutPrograms } from "@/app/(landing-pages)/(client)/workout-programs/related-workout-programs"
import { useTheme } from "@/contexts/theme-context"

const workoutProgramData = {
  title: "Free 3-Day Full Body Workout Program - Build Strength & Muscle",
  subtitle:
    "Transform your fitness with our scientifically-designed 3-day full body workout program. Perfect for beginners and intermediate lifters.",
  rating: "5/5 by our users",
  ctaText: "Get Free 3-Day Program",
  ctaButtonStyle: "green" as const, // Added green styling for first CTA button
  features: [
    {
      title: "Complete Full Body Training",
      description:
        "Work every major muscle group 3 times per week with compound movements for maximum muscle growth and strength gains",
    },
    {
      title: "Beginner to Intermediate Friendly",
      description:
        "Progressive program designed for all fitness levels with clear exercise instructions and progression guidelines",
    },
    {
      title: "Time Efficient Workouts",
      description:
        "45-60 minute sessions, 3 days per week - perfect for busy schedules while delivering maximum results",
    },
    {
      title: "Science-Based Programming",
      description:
        "Evidence-based exercise selection, rep ranges, and progression schemes for optimal muscle building and strength development",
    },
  ],
  ctaData: {
    title: "Start Your Free 3-Day Full Body Program Today",
    subtitle: "Download the Juice app and access your complete workout program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const, // Kept black styling for second CTA button
    ctaButtonUrl: "https://app.juice.fitness/programs/76d24001-bf04-40d1-8976-fa20c93a30cc", // Added redirect URL for free 3-day program
    bulletPoints: [
      "Free full body workout program included",
      "Track your progress and see real results",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What is a 3-day full body workout program?",
      answer:
        "A 3-day full body workout program trains all major muscle groups in each session, performed 3 times per week. This approach is highly effective for building strength and muscle while allowing adequate recovery time between sessions.",
    },
    {
      question: "Is this program suitable for beginners?",
      answer:
        "Yes! Our 3-day full body program is perfect for beginners. It focuses on fundamental compound movements with clear progression guidelines, making it easy to learn proper form and build a strong foundation.",
    },
    {
      question: "How long are the workouts?",
      answer:
        "Each workout session takes approximately 45-60 minutes to complete, including warm-up and cool-down. The program is designed to be time-efficient while delivering maximum results.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "The program is designed for a standard gym with barbells, dumbbells, and basic equipment. We also provide alternative exercises for home workouts with minimal equipment.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "The Juice app includes built-in progress tracking features. Log your weights, reps, and sets for each exercise to monitor your strength gains and muscle development over time.",
    },
    {
      question: "Can I do this program at home?",
      answer:
        "Yes! While the program is optimized for gym training, we provide home workout alternatives using bodyweight exercises and minimal equipment like dumbbells or resistance bands.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Free 3-Day Full Body Workout Program",
    description:
      "Complete 3-day full body workout program designed for building strength and muscle. Perfect for beginners and intermediate lifters.",
    url: "https://juice-website-mirre.vercel.app/workout-programs/free/3-day-full-body",
    category: "Strength Training",
    exerciseType: "Full Body Workout",
    duration: "P21D",
    workload: "3 days per week",
    provider: {
      "@type": "Organization",
      name: "Juice",
      logo: {
        "@type": "ImageObject",
        url: "https://juice-website-mirre.vercel.app/images/juiceNewLogoPrime.png",
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free 3-day full body workout program with progress tracking",
    },
  },
}

export default function ThreeDayFullBodyClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose this workout program?",
    features: workoutProgramData.features,
    ctaData: workoutProgramData.ctaData,
  }

  const faqData = {
    title: "Frequently Asked Questions",
    faqs: workoutProgramData.faqs,
  }

  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workoutProgramData.structuredData) }}
      />
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <ClientHeroSection {...heroData} />
        <ClientFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />

        <section className="container mx-auto px-4 md:px-6 py-16">
          <RelatedWorkoutPrograms currentSlug="3-day-full-body" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
