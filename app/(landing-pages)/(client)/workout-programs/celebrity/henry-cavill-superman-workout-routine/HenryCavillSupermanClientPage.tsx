"use client"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WorkoutProgramsHeroSection } from "@/app/(landing-pages)/(client)/workout-programs/components/workout-programs-hero-section"
import { WorkoutFreeProgramsFeaturesSection } from "@/app/(landing-pages)/(client)/workout-programs/components/workout-free-programs-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { RelatedWorkoutPrograms } from "@/app/(landing-pages)/(client)/workout-programs/components/related-workout-programs"
import { useTheme } from "@/contexts/theme-context"

const workoutProgramData = {
  title: "Henry Cavill's Superman Workout Routine - Superhero Training",
  subtitle:
    "Train like Superman with Henry Cavill's intense workout routine. Features compound movements, functional training, and superhero-level strength building exercises for maximum results.",
  rating: "4.9/5 by our users",
  ctaText: "Get Superman Program",
  ctaButtonStyle: "green" as const,
  programId: "c303aed1-8168-44b2-aa37-d6ef8d9c8c5b", // Add programId for Henry Cavill
  features: [
    {
      title: "Superhero-Level Strength",
      description:
        "Build the strength and physique of Superman with compound movements and functional training. Every exercise is designed to build real-world strength and power.",
    },
    {
      title: "Intense Training Approach",
      description:
        "Push your limits with Henry Cavill's demanding workout routine. High-intensity training that challenges both your physical and mental strength.",
    },
    {
      title: "Functional Movement Patterns",
      description:
        "Focus on movements that translate to real-world strength and athleticism. Build a physique that's not just for show, but for performance.",
    },
    {
      title: "Superhero Physique",
      description:
        "Develop the broad shoulders, powerful chest, and overall muscular development that defines the Superman physique. Train like a superhero.",
    },
  ],
  ctaData: {
    title: "Start Henry Cavill's Superman Program Today",
    subtitle: "Download the Juice app and access this superhero training program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const,
    ctaButtonUrl: "https://app.juice.fitness/programs/henry-cavill-superman-workout-routine",
    bulletPoints: [
      "Free superhero workout program included",
      "Superhero-level training principles",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What makes Henry Cavill's approach different?",
      answer:
        "Henry Cavill's training focuses on building functional strength and a superhero physique. His approach combines compound movements, functional training, and high-intensity workouts designed to build real-world strength and athleticism.",
    },
    {
      question: "What is a superhero training program?",
      answer:
        "A superhero training program focuses on building the strength, power, and physique of a superhero. It emphasizes compound movements, functional training, and high-intensity workouts that develop both physical and mental strength.",
    },
    {
      question: "How long are the workouts?",
      answer:
        "Each workout session takes approximately 60-90 minutes to complete, including warm-up and cool-down. The program is designed to be intense and challenging while delivering maximum results for superhero-level strength.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "The program is designed for a well-equipped gym with barbells, dumbbells, pull-up bars, and functional training equipment. Henry's approach requires access to a variety of equipment for optimal results.",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "This program is designed for intermediate to advanced lifters who have experience with compound movements and high-intensity training. Beginners should first build a foundation of strength before attempting this program.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "The Juice app includes built-in progress tracking features. Log your weights, reps, and sets for each exercise to monitor your strength gains and ensure you're progressing toward superhero-level strength.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Henry Cavill's Superman Workout Routine",
    description:
      "Superhero training program featuring compound movements, functional training, and high-intensity workouts. Designed to build the strength and physique of Superman with real-world athleticism.",
    url: "https://juice-website-mirre.vercel.app/workout-programs/celebrity/henry-cavill-superman-workout-routine",
    category: "Celebrity Training Program",
    exerciseType: "Superhero Workout",
    duration: "P28D",
    workload: "4-5 days per week",
    author: {
      "@type": "Person",
      name: "Henry Cavill",
      description: "Actor and fitness enthusiast known for his superhero roles"
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
      description: "Free celebrity superhero workout program with functional training principles",
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
        value: "Henry Cavill"
      },
      {
        "@type": "PropertyValue",
        name: "Approach",
        value: "Superhero Functional Training"
      }
    ]
  },
}

export default function HenryCavillSupermanClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose Henry Cavill's Superman program?",
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
        <WorkoutFreeProgramsFeaturesSection {...featuresData} />
        <ClientFAQSection {...faqData} />

        <section className="container mx-auto px-4 md:px-6 py-16">
          <RelatedWorkoutPrograms currentSlug="henry-cavill-superman-workout-routine" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
