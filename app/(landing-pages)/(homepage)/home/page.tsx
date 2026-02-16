import type { Metadata } from "next"
import TrainerHomePage from "./TrainerHomePage"

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
    canonical: "/home",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/home",
    title: "Juice - All-in-One Platform for Personal Trainers",
    description:
      "Get new clients and keep them with our complete platform for personal trainers. Website builder, workout programs, and client management in one place.",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-logo-og.png",
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
    images: ["/images/juice-logo-og.png"],
    creator: "@juice_app",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function BackupHomePage() {
  return <TrainerHomePage />
}

