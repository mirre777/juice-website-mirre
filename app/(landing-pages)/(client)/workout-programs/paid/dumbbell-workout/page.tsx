import type { Metadata } from "next"
import DumbbellWorkoutClientPage from "./DumbbellWorkoutClientPage"

export const metadata: Metadata = {
  title: "Dumbbell Workout Program – Build Muscle & Strength at Home | Juice",
  description:
    "Transform your physique with our comprehensive dumbbell workout program. Build muscle, increase strength, and get fit at home with structured training plans and expert guidance.",
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
    title: "Dumbbell Workout Program – Build Muscle & Strength at Home",
    description:
      "Transform your physique with our comprehensive dumbbell workout program. Build muscle, increase strength, and get fit at home with structured training plans and expert guidance.",
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
    title: "Dumbbell Workout Program – Build Muscle & Strength at Home",
    description:
      "Transform your physique with our comprehensive dumbbell workout program. Build muscle, increase strength, and get fit at home with structured training plans and expert guidance.",
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
