import type { Metadata } from "next"
import DumbbellWorkoutClientPage from "./DumbbellWorkoutClientPage"

export const metadata: Metadata = {
  title: "Dumbbell Workouts for Fast Muscle Gains | Juice",
  description:
    "Build strength with simple dumbbell workouts. No fluff. Just fast, effective training you can use with clients anywhere. Perfect for online or gym PTs.",
  keywords: [
    "dumbbell workout program",
    "dumbbell workout",
    "home dumbbell workout",
    "dumbbell training program",
    "dumbbell muscle building",
    "dumbbell strength training",
    "home workout program",
    "dumbbell exercises",
    "full body dumbbell workout",
    "dumbbell workout plan",
    "muscle building program",
    "strength training program",
  ],
  openGraph: {
    title: "Top Dumbbell Workouts for Real Results",
    description:
      "Train your clients with fast, effective dumbbell routines. These workouts save time, build muscle, and work in any space.",
    url: "/workout-programs/paid/dumbbell-workout",
    siteName: "Juice",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Dumbbell Workout Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Dumbbell Workouts for Real Results",
    description:
      "Train your clients with fast, effective dumbbell routines. These workouts save time, build muscle, and work in any space.",
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
    canonical: "/workout-programs/paid/dumbbell-workout",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function DumbbellWorkoutPage() {
  return <DumbbellWorkoutClientPage />
}
