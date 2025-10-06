import type { Metadata } from "next"
import { getAllWorkoutPrograms } from "@/lib/workout-programs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WorkoutProgramsClient } from "@/app/(landing-pages)/(client)/workout-programs/components/workout-programs-collection"

export const metadata: Metadata = {
  title: "Free Workout Programs - Build Strength & Muscle | Juice",
  description:
    "Discover scientifically-designed workout programs for all fitness levels. From beginner full body routines to advanced strength training programs.",
  keywords: [
    "workout programs",
    "free workout programs",
    "strength training programs",
    "muscle building programs",
    "fitness programs",
    "gym workout plans",
    "home workout programs",
    "beginner workout programs",
    "advanced workout programs",
  ],
  openGraph: {
    title: "Free Workout Programs - Build Strength & Muscle",
    description:
      "Discover scientifically-designed workout programs for all fitness levels. From beginner full body routines to advanced strength training.",
    url: "/workout-programs",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Workout Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Workout Programs - Build Strength & Muscle",
    description:
      "Discover scientifically-designed workout programs for all fitness levels. From beginner full body routines to advanced strength training.",
    images: ["/images/og-feature-graphic.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/workout-programs",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function WorkoutProgramsPage() {
  const programs = getAllWorkoutPrograms()

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-20 pt-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">Workout Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Scientifically-designed workout programs for all fitness levels. Build strength, muscle, and transform your
            fitness journey.
          </p>
        </div>

        <WorkoutProgramsClient programs={programs} />
      </div>

      <Footer />
    </main>
  )
}
