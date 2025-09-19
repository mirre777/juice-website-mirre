import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WorkoutPlannerHero from "@/components/workout-planner-hero" // Import the new component

export const metadata: Metadata = {
  title: "Juice Workout Planner | Build Custom Fitness Programs for Clients",
  description:
    "Design and deliver personalized workout programs with the Juice Workout Planner. Streamline program creation for personal trainers and fitness coaches with our intuitive builder.",
  keywords: [
    "workout planner",
    "fitness program builder",
    "personal trainer software",
    "workout program creator",
    "exercise program design",
    "fitness coaching tools",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/workout-planner",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/workout-planner",
    title: "Juice Workout Planner | Build Custom Fitness Programs",
    description:
      "Design and deliver personalized workout programs with our intuitive workout planner. Perfect for personal trainers and fitness coaches.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Workout Planner - Build Custom Fitness Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Workout Planner | Build Custom Fitness Programs",
    description:
      "Design and deliver personalized workout programs with our intuitive workout planner for personal trainers.",
    images: ["/images/og-feature-graphic.png"],
    creator: "@juice_app",
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
}

export default function WorkoutPlannerPage() {
  // Using isCoach=true for trainer-style (white background) navbar
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar isHomePage={false} isCoach={true} />
      <WorkoutPlannerHero /> {/* Use the new hero component */}
      <Footer />
    </main>
  )
}
