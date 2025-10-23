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
  title: "Michael B. Jordan's Creed Workout Routine - Boxing Training",
  subtitle:
    "Train like a champion with Michael B. Jordan's Creed workout routine. Features boxing training, athletic conditioning, and fighter-level strength building exercises for maximum results.",
  rating: "4.9/5 by our users",
  ctaText: "Get Creed Program",
  ctaButtonStyle: "green" as const,
  features: [
    {
      title: "Fighter-Level Conditioning",
      description:
        "Build the endurance and strength of a champion boxer with boxing-specific training. Every exercise is designed to build real-world athleticism and fighting power.",
    },
    {
      title: "Athletic Performance Focus",
      description:
        "Push your limits with Michael B. Jordan's demanding workout routine. High-intensity training that challenges both your physical and mental toughness.",
    },
    {
      title: "Boxing Movement Patterns",
      description:
        "Focus on movements that translate to real-world athleticism and fighting ability. Build a physique that's not just for show, but for performance in the ring.",
    },
    {
      title: "Champion Physique",
      description:
        "Develop the lean, powerful build and overall athletic development that defines a champion boxer. Train like a fighter.",
    },
  ],
  ctaData: {
    title: "Start Michael B. Jordan's Creed Program Today",
    subtitle: "Download the Juice app and access this boxing training program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const,
    ctaButtonUrl: "https://app.juice.fitness/programs/michael-b-jordan-creed-workout",
    bulletPoints: [
      "Free boxing workout program included",
      "Fighter-level training principles",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What makes Michael B. Jordan's approach different?",
      answer:
        "Michael B. Jordan's training focuses on building athletic performance and a fighter's physique. His approach combines boxing training, athletic conditioning, and high-intensity workouts designed to build real-world athleticism and fighting ability.",
    },
    {
      question: "What is a boxing training program?",
      answer:
        "A boxing training program focuses on building the endurance, strength, and athleticism of a fighter. It emphasizes boxing-specific movements, athletic conditioning, and high-intensity workouts that develop both physical and mental toughness.",
    },
    {
      question: "How long are the workouts?",
      answer:
        "Each workout session takes approximately 60-90 minutes to complete, including warm-up and cool-down. The program is designed to be intense and challenging while delivering maximum results for fighter-level conditioning.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "The program is designed for a well-equipped gym with barbells, dumbbells, boxing equipment, and functional training equipment. Michael's approach requires access to boxing gear and a variety of equipment for optimal results.",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "This program is designed for intermediate to advanced athletes who have experience with high-intensity training and boxing movements. Beginners should first build a foundation of fitness before attempting this program.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "The Juice app includes built-in progress tracking features. Log your weights, reps, and sets for each exercise to monitor your athletic gains and ensure you're progressing toward fighter-level conditioning.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Michael B. Jordan's Creed Workout Routine",
    description:
      "Boxing training program featuring athletic conditioning, boxing movements, and high-intensity workouts. Designed to build the endurance and strength of a champion boxer with real-world athleticism.",
    url: "https://juice-website-mirre.vercel.app/workout-programs/celebrity/michael-b-jordan-creed-workout",
    category: "Celebrity Training Program",
    exerciseType: "Boxing Workout",
    duration: "P28D",
    workload: "4-5 days per week",
    author: {
      "@type": "Person",
      name: "Michael B. Jordan",
      description: "Actor and fitness enthusiast known for his boxing roles"
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
      description: "Free celebrity boxing workout program with athletic training principles",
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
        value: "Michael B. Jordan"
      },
      {
        "@type": "PropertyValue",
        name: "Approach",
        value: "Boxing Athletic Training"
      }
    ]
  },
}

export default function MichaelBJordanCreedClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose Michael B. Jordan's Creed program?",
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
          <RelatedWorkoutPrograms currentSlug="michael-b-jordan-creed-workout" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
