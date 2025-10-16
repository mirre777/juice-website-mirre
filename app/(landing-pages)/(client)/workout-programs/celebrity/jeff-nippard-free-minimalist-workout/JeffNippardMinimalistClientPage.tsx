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
  title: "Jeff Nippard's Free Minimalist Workout - Evidence-Based Training",
  subtitle:
    "Train like a mad scientist with Jeff Nippard's evidence-based minimalist program. Features flat dumbbell press, Romanian deadlifts, lat pulldowns, and more proven exercises for maximum results.",
  rating: "4.9/5 by our users",
  ctaText: "Get Free Minimalist Program",
  ctaButtonStyle: "green" as const,
  features: [
    {
      title: "Evidence-Based Training",
      description:
        "Built on the latest exercise science research. Every exercise, set, and rep is backed by peer-reviewed studies for maximum effectiveness.",
    },
    {
      title: "Minimalist Approach",
      description:
        "Focus on the most effective exercises that deliver 80% of results with 20% of the effort. Perfect for busy schedules without compromising results.",
    },
    {
      title: "Progressive Overload",
      description:
        "Systematic progression scheme that ensures continuous improvement. Track your progress and see real strength and muscle gains over time.",
    },
    {
      title: "Time Efficient",
      description:
        "3 days per week, 45-60 minutes per session. Get maximum results with minimal time investment - perfect for the modern lifestyle.",
    },
  ],
  ctaData: {
    title: "Start Jeff Nippard's Minimalist Program Today",
    subtitle: "Download the Juice app and access this evidence-based training program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const,
    ctaButtonUrl: "https://app.juice.fitness/programs/jeff-nippard-free-minimalist-workout",
    bulletPoints: [
      "Free minimalist workout program included",
      "Evidence-based training principles",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What makes Jeff Nippard's approach different?",
      answer:
        "Jeff Nippard is known for his evidence-based approach to training. His programs are built on peer-reviewed research and focus on the most effective exercises and training methods proven to work.",
    },
    {
      question: "What is a minimalist training program?",
      answer:
        "A minimalist program focuses on the most effective exercises that deliver the majority of results with minimal complexity. It's perfect for those who want maximum gains with minimal time investment.",
    },
    {
      question: "How long are the workouts?",
      answer:
        "Each workout session takes approximately 45-60 minutes to complete, including warm-up and cool-down. The program is designed to be time-efficient while delivering maximum results.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "The program is designed for a standard gym with barbells, dumbbells, and basic equipment. Jeff's minimalist approach means you don't need fancy machines - just the fundamentals.",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "This program is designed for intermediate lifters who have some experience with compound movements. Beginners should first master basic form before attempting this program.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "The Juice app includes built-in progress tracking features. Log your weights, reps, and sets for each exercise to monitor your strength gains and ensure progressive overload.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Jeff Nippard's Free Minimalist Workout",
    description:
      "Evidence-based minimalist training program featuring flat dumbbell press, Romanian deadlifts, lat pulldowns, and more proven exercises. Designed for maximum results with minimal time investment.",
    url: "https://juice-website-mirre.vercel.app/workout-programs/celebrity/jeff-nippard-free-minimalist-workout",
    category: "Celebrity Training Program",
    exerciseType: "Minimalist Workout",
    duration: "P21D",
    workload: "3 days per week",
    author: {
      "@type": "Person",
      name: "Jeff Nippard",
      description: "Exercise scientist and evidence-based fitness educator"
    },
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
      description: "Free celebrity minimalist workout program with evidence-based training principles",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Program Type",
        value: "Celebrity"
      },
      {
        "@type": "PropertyValue", 
        name: "Trainer",
        value: "Jeff Nippard"
      },
      {
        "@type": "PropertyValue",
        name: "Approach",
        value: "Evidence-Based Minimalist"
      }
    ]
  },
}

export default function JeffNippardMinimalistClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose Jeff Nippard's minimalist program?",
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
        <WorkoutProgramsHeroSection {...heroData} />
        <WorkoutProgramsFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />

        <section className="container mx-auto px-4 md:px-6 py-16">
          <RelatedWorkoutPrograms currentSlug="jeff-nippard-free-minimalist-workout" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
