import type { Metadata } from "next"
import MichaelBJordanCreedClientPage from "./MichaelBJordanCreedClientPage"

export const metadata: Metadata = {
  title: "Michael B. Jordan's Creed Workout Routine - Boxing Training | Juice",
  description:
    "Train like a champion with Michael B. Jordan's Creed workout routine. Features boxing training, athletic conditioning, and fighter-level strength building exercises for maximum results.",
  keywords: [
    "michael b jordan creed workout",
    "michael b jordan workout routine",
    "creed workout program",
    "celebrity workout program",
    "boxing training program",
    "athletic conditioning",
    "fighter training",
    "boxing strength",
    "michael b jordan training",
    "celebrity trainer program",
    "boxing bodybuilding",
    "intense workout routine",
    "fighter strength training",
    "athletic performance",
    "6-day split with progressive overload",
  ],
  openGraph: {
    title: "Michael B. Jordan's Creed Workout Routine - Celebrity Training | Juice",
    description:
      "Train like a champion with Michael B. Jordan's Creed workout routine. Features boxing training, athletic conditioning, and fighter-level strength building exercises.",
    url: "/workout-programs/celebrity/michael-b-jordan-creed-workout",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Michael B. Jordan's Creed Workout Routine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael B. Jordan's Creed Workout Routine - Celebrity Training",
    description:
      "Train like a champion with Michael B. Jordan's Creed workout routine. Features boxing training, athletic conditioning, and fighter-level strength building exercises.",
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
    canonical: "/workout-programs/celebrity/michael-b-jordan-creed-workout",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function MichaelBJordanCreedPage() {
  return <MichaelBJordanCreedClientPage />
}
