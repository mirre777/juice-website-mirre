import type { Metadata } from "next"
import JeffNippardMinimalistClientPage from "./JeffNippardMinimalistClientPage"

export const metadata: Metadata = {
  title: "Jeff Nippard's Free Minimalist Workout - Evidence-Based Training | Juice",
  description:
    "Train like a scientist with Jeff Nippard's free minimalist workout program. Features flat dumbbell press, Romanian deadlifts, lat pulldowns, and more evidence-based exercises for maximum results.",
  keywords: [
    "jeff nippard free minimalist workout",
    "jeff nippard workout program",
    "celebrity workout program",
    "minimalist training program",
    "evidence based training",
    "flat dumbbell press",
    "dumbbell Romanian deadlift",
    "lat pulldown workout",
    "dumbbell step up",
    "triceps extension",
    "lateral raise",
    "leg press",
    "hack squat",
    "smith machine press",
    "t-bar row",
    "leg curl",
    "biceps curl",
    "cable crunch",
    "jeff nippard training",
    "celebrity trainer program",
    "minimalist bodybuilding",
    "evidence based workout",
    "minimalist strength training",
  ],
  openGraph: {
    title: "Jeff Nippard's Free Minimalist Workout - Celebrity Training | Juice",
    description:
      "Train like a scientist with Jeff Nippard's free minimalist workout. Features flat dumbbell press, Romanian deadlifts, lat pulldowns, and more evidence-based exercises.",
    url: "/workout-programs/celebrity/jeff-nippard-free-minimalist-workout",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Jeff Nippard's Free Minimalist Workout Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeff Nippard's Free Minimalist Workout - Celebrity Training",
    description:
      "Train like a scientist with Jeff Nippard's free minimalist workout. Features flat dumbbell press, Romanian deadlifts, lat pulldowns, and more evidence-based exercises.",
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
    canonical: "/workout-programs/celebrity/jeff-nippard-free-minimalist-workout",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function JeffNippardMinimalistPage() {
  return <JeffNippardMinimalistClientPage />
}
