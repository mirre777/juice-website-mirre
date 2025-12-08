import type { Metadata } from "next"
import FindATrainerClientPage from "./FindATrainerClientPage"
import { getArticlesByCategory } from "@/lib/blog"
import { fetchTrainersForCity } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Find a Trainer - Juice",
  description: "Find certified personal trainers in London, Berlin, Amsterdam, Vienna & across Europe. Browse verified fitness coaches specializing in strength training, nutrition, and body transformation. Book your trainer today.",
  keywords: [
    "find personal trainer near me",
    "certified personal trainers Europe",
    "online personal trainer",
    "strength training coach",
    "nutrition coach",
    "fitness trainer London",
    "personal trainer Berlin",
    "Amsterdam fitness coach",
    "body transformation trainer",
    "powerlifting coach",
    "gym trainer",
    "home workout trainer",
    "virtual personal training",
    "best personal trainer",
    "affordable personal trainer",
    "female personal trainer",
    "male personal trainer",
    "personal training packages",
    "fitness coach directory",
  ],
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer",
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
  openGraph: {
    title: "Find a Trainer - Juice",
    description: "Find certified personal trainers in London, Berlin, Amsterdam, Vienna & across Europe. Browse verified fitness coaches specializing in strength training, nutrition, and body transformation. Book your trainer today.",
    url: "https://juice.fitness/findatrainer",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-og-image.png",
        width: 1200,
        height: 630,
        alt: "Juice - Find a Trainer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Trainer - Juice",
    description: "Find certified personal trainers in London, Berlin, Amsterdam, Vienna & across Europe. Browse verified fitness coaches specializing in strength training, nutrition, and body transformation. Book your trainer today.",
    images: ["/images/juice-og-image.png"],
  },
  other: {
    "geo.region": "EU",
    "geo.placename": "Europe",
  },
}

export default async function FindATrainerPage() {
  // Fetch trainer counts for each city
  const cityNames = ["London", "Berlin", "Amsterdam", "Vienna", "Rotterdam", "The Hague"]
  const trainerCounts = await Promise.all(
    cityNames.map(async (city) => {
      const trainers = await fetchTrainersForCity(city)
      return { city, count: trainers.length }
    })
  )

  // Fetch related articles
  const relatedArticles = await getArticlesByCategory("Advice", 2)

  return (
    <FindATrainerClientPage 
      trainerCounts={trainerCounts}
      relatedArticles={relatedArticles}
    />
  )
}
