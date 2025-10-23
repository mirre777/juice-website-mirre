import type { Metadata } from "next"
import HenryCavillSupermanClientPage from "./HenryCavillSupermanClientPage"

export const metadata: Metadata = {
  title: "Henry Cavill's Superman Workout Routine - Superhero Training | Juice",
  description:
    "Train like Superman with Henry Cavill's intense workout routine. Features compound movements, functional training, and superhero-level strength building exercises for maximum results.",
  keywords: [
    "henry cavill superman workout",
    "henry cavill workout routine",
    "superman workout program",
    "celebrity workout program",
    "superhero training program",
    "compound movements",
    "functional training",
    "strength building",
    "superman physique",
    "henry cavill training",
    "celebrity trainer program",
    "superhero bodybuilding",
    "intense workout routine",
    "superman strength training",
  ],
  openGraph: {
    title: "Henry Cavill's Superman Workout Routine - Celebrity Training | Juice",
    description:
      "Train like Superman with Henry Cavill's intense workout routine. Features compound movements, functional training, and superhero-level strength building exercises.",
    url: "/workout-programs/celebrity/henry-cavill-superman-workout-routine",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Henry Cavill's Superman Workout Routine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry Cavill's Superman Workout Routine - Celebrity Training",
    description:
      "Train like Superman with Henry Cavill's intense workout routine. Features compound movements, functional training, and superhero-level strength building exercises.",
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
    canonical: "/workout-programs/celebrity/henry-cavill-superman-workout-routine",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function HenryCavillSupermanPage() {
  return <HenryCavillSupermanClientPage />
}
