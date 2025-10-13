"use client"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WorkoutProgramsHeroSection } from "@/app/(landing-pages)/(client)/workout-programs/components/workout-programs-hero-section"
import { WorkoutProgramsFeaturesSection } from "@/app/(landing-pages)/(client)/workout-programs/components/workout-programs-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { RelatedWorkoutPrograms } from "@/app/(landing-pages)/(client)/workout-programs/components/related-workout-programs"
import { useTheme } from "@/contexts/theme-context"

const workoutProgramData = {
  title: "Free Mobility Training Program - Improve Flexibility & Movement",
  subtitle:
    "Enhance your movement quality and flexibility with our comprehensive mobility training program. Perfect for all fitness levels.",
  rating: "5/5 by our users",
  ctaText: "Get Free Mobility Program",
  ctaButtonStyle: "green" as const, // Added green styling for first CTA button
  programId: "76d24001-bf04-40d1-8976-fa20c93a30cc",
  features: [
    {
      title: "Complete Movement Assessment",
      description:
        "Comprehensive mobility screening to identify tight areas and movement restrictions, with personalized exercise prescriptions",
    },
    {
      title: "All Fitness Levels Welcome",
      description:
        "Progressive mobility program designed for beginners to advanced athletes, with modifications for every ability level",
    },
    {
      title: "Flexible Time Commitment",
      description:
        "15-30 minute sessions that fit into any schedule - perfect for daily practice or pre/post workout routines",
    },
    {
      title: "Evidence-Based Approach",
      description:
        "Science-backed mobility techniques including dynamic stretching, static holds, and movement preparation protocols",
    },
  ],
  ctaData: {
    title: "Start Your Free Mobility Training Program Today",
    subtitle: "Download the Juice app and access your complete mobility program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const, // Kept black styling for second CTA button
    ctaButtonUrl: "https://app.juice.fitness/programs/mobility-training", // Added redirect URL for mobility training program
    bulletPoints: [
      "Free mobility training program included",
      "Track your flexibility improvements",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What is mobility training?",
      answer:
        "Mobility training focuses on improving your range of motion, flexibility, and movement quality. It includes stretching, dynamic movements, and joint mobility exercises to enhance overall movement patterns and reduce injury risk.",
    },
    {
      question: "How is mobility different from flexibility?",
      answer:
        "Flexibility is passive range of motion, while mobility is active range of motion with strength and control. Mobility training combines flexibility with stability and strength to create functional movement patterns.",
    },
    {
      question: "How often should I do mobility training?",
      answer:
        "For best results, aim for 15-30 minutes daily or 3-4 times per week. Even 10 minutes of daily mobility work can significantly improve your movement quality and reduce stiffness.",
    },
    {
      question: "Do I need any equipment?",
      answer:
        "The program is designed to work with minimal equipment. A yoga mat, foam roller, and resistance bands are helpful but not required. Most exercises can be done with just your bodyweight.",
    },
    {
      question: "Can mobility training help with pain?",
      answer:
        "Yes! Mobility training can help reduce muscle tension, improve posture, and address movement imbalances that often contribute to pain. However, consult a healthcare provider for persistent pain issues.",
    },
    {
      question: "Is this suitable for athletes?",
      answer:
        "Absolutely! Athletes at all levels benefit from mobility training. It improves performance, reduces injury risk, and enhances recovery. The program includes sport-specific mobility exercises.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Free Mobility Training Program",
    description:
      "Complete mobility training program designed for improving flexibility, movement quality, and reducing injury risk. Perfect for all fitness levels.",
    url: "https://juice-website-mirre.vercel.app/workout-programs/free/mobility-training",
    category: "Mobility Training",
    exerciseType: "Flexibility and Movement",
    duration: "P30D",
    workload: "Daily or 3-4 times per week",
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
      description: "Free mobility training program with progress tracking",
    },
  },
}

export default function MobilityTrainingClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose this mobility program?",
    features: workoutProgramData.features,
    ctaData: workoutProgramData.ctaData,
    programId: workoutProgramData.programId,
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
        <WorkoutProgramsHeroSection {...heroData} />
        <WorkoutProgramsFeaturesSection {...featuresData} programId={workoutProgramData.programId} />
        <ClientFAQSection {...faqData} />

        <section className="container mx-auto px-4 md:px-6 py-16">
          <RelatedWorkoutPrograms currentSlug="mobility-training" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
