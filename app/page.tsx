import type { Metadata } from "next"
import { HomePageClient } from "./HomePageClient"

export const metadata: Metadata = {
  title: "Juice - All-in-One Platform for Personal Trainers | Get More Clients",
  description:
    "The complete platform for personal trainers to get new clients and keep them. Build websites, create workout programs, and manage clients all in one place. Start free today.",
  keywords: [
    "personal trainer platform",
    "fitness coaching software",
    "personal trainer website builder",
    "workout program creator",
    "client management for trainers",
    "personal training business",
    "fitness app for trainers",
    "get personal training clients",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Juice - All-in-One Platform for Personal Trainers",
    description:
      "Get new clients and keep them with our complete platform for personal trainers. Website builder, workout programs, and client management in one place.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice - All-in-One Platform for Personal Trainers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice - All-in-One Platform for Personal Trainers",
    description:
      "Get new clients and keep them. Complete platform with website builder, workout programs, and client management.",
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

export default function HomePage() {
  return <HomePageClient />
}
