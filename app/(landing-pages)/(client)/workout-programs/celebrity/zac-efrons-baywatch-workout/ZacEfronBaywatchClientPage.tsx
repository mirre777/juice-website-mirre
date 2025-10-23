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
  title: "Zac Efron's Baywatch Workout Routine - Beach Body Training",
  subtitle:
    "Get the Baywatch physique with Zac Efron's intense workout routine. Features beach body training, lean muscle building, and lifeguard-level conditioning for maximum results.",
  rating: "4.9/5 by our users",
  ctaText: "Get Baywatch Program",
  ctaButtonStyle: "green" as const,
  programId: "508e8a92-aa3c-4354-8880-b095addce3ee",
  features: [
    {
      title: "Beach Body Conditioning",
      description:
        "Build the lean, defined physique of a Baywatch lifeguard with beach-specific training. Every exercise is designed to build real-world athleticism and beach-ready strength.",
    },
    {
      title: "Lifeguard Performance Focus",
      description:
        "Push your limits with Zac Efron's demanding workout routine. High-intensity training that challenges both your physical and mental endurance for lifeguard-level fitness.",
    },
    {
      title: "Beach Movement Patterns",
      description:
        "Focus on movements that translate to real-world beach athleticism and lifeguard ability. Build a physique that's not just for show, but for performance on the beach.",
    },
    {
      title: "Baywatch Physique",
      description:
        "Develop the lean, muscular build and overall beach-ready development that defines a Baywatch lifeguard. Train like a beach hero.",
    },
  ],
  ctaData: {
    title: "Start Zac Efron's Baywatch Program Today",
    subtitle: "Download the Juice app and access this beach body training program instantly.",
    ctaButtonText: "Get Program",
    ctaButtonStyle: "black" as const,
    ctaButtonUrl: "https://app.juice.fitness/programs/508e8a92-aa3c-4354-8880-b095addce3ee",
    bulletPoints: [
      "Free beach body workout program included",
      "Lifeguard-level training principles",
      "No subscription required to get started",
    ],
  },
  faqs: [
    {
      question: "What makes Zac Efron's approach different?",
      answer:
        "Zac Efron's training focuses on building beach-ready athleticism and a lifeguard's physique. His approach combines beach body training, lean muscle building, and high-intensity workouts designed to build real-world beach athleticism and lifeguard ability.",
    },
    {
      question: "What is a beach body training program?",
      answer:
        "A beach body training program focuses on building the lean, defined physique and athleticism of a lifeguard. It emphasizes beach-specific movements, lean muscle building, and high-intensity workouts that develop both physical and mental endurance for beach performance.",
    },
    {
      question: "How long are the workouts?",
      answer:
        "Each workout session takes approximately 60-90 minutes to complete, including warm-up and cool-down. The program is designed to be intense and challenging while delivering maximum results for lifeguard-level conditioning.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "The program is designed for a well-equipped gym with barbells, dumbbells, and functional training equipment. Zac's approach requires access to a variety of equipment for optimal beach body results.",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "This program is designed for intermediate to advanced athletes who have experience with high-intensity training and beach body movements. Beginners should first build a foundation of fitness before attempting this program.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "The Juice app includes built-in progress tracking features. Log your weights, reps, and sets for each exercise to monitor your beach body gains and ensure you're progressing toward lifeguard-level conditioning.",
    },
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ExercisePlan",
    name: "Zac Efron's Baywatch Workout Routine",
    description:
      "Beach body training program featuring lean muscle building, lifeguard conditioning, and high-intensity workouts. Designed to build the lean, defined physique of a Baywatch lifeguard with real-world beach athleticism.",
    url: "https://juice.fitness/workout-programs/celebrity/zac-efrons-baywatch-workout",
    category: "Celebrity Training Program",
    exerciseType: "Beach Body Workout",
    duration: "P28D",
    workload: "4-5 days per week",
    author: {
      "@type": "Person",
      name: "Zac Efron",
      description: "Actor and fitness enthusiast known for his Baywatch role"
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
      description: "Free celebrity beach body workout program with lifeguard training principles",
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
        value: "Zac Efron"
      },
      {
        "@type": "PropertyValue",
        name: "Approach",
        value: "Beach Body Lifeguard Training"
      }
    ]
  },
}

export default function ZacEfronBaywatchClientPage() {
  const { setIsCoach } = useTheme()

  const heroData = {
    title: workoutProgramData.title,
    subtitle: workoutProgramData.subtitle,
    rating: workoutProgramData.rating,
    ctaText: workoutProgramData.ctaText,
  }

  const featuresData = {
    title: "Why choose Zac Efron's Baywatch program?",
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
          <RelatedWorkoutPrograms currentSlug="zac-efrons-baywatch-workout" />
        </section>

        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
