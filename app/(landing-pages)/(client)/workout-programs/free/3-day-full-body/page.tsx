import type { Metadata } from "next"
import ThreeDayFullBodyClientPage from "./ThreeDayFullBodyClientPage"

export const metadata: Metadata = {
  title: "Free 3-Day Full Body Workout Program - Build Strength & Muscle | Juice",
  description:
    "Transform your fitness with our scientifically-designed 3-day full body workout program. Perfect for beginners and intermediate lifters looking to build strength, muscle, and improve overall fitness.",
  keywords: [
    "3 day full body workout",
    "full body workout program",
    "free workout program",
    "3 day workout plan",
    "full body training",
    "strength training program",
    "muscle building workout",
    "beginner workout program",
    "complete body workout",
    "3 dagen full body",
    "fullbody training",
    "fitness full body",
  ],
  openGraph: {
    title: "Free 3-Day Full Body Workout Program - Build Strength & Muscle",
    description:
      "Transform your fitness with our scientifically-designed 3-day full body workout program. Perfect for beginners and intermediate lifters.",
    url: "/workout-programs/free/3-day-full-body",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Free 3-Day Full Body Workout Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 3-Day Full Body Workout Program - Build Strength & Muscle",
    description:
      "Transform your fitness with our scientifically-designed 3-day full body workout program. Perfect for beginners and intermediate lifters.",
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
    canonical: "/workout-programs/free/3-day-full-body",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function ThreeDayFullBodyPage() {
  return <ThreeDayFullBodyClientPage />
}
