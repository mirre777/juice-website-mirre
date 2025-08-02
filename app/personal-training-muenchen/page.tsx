import type { Metadata } from "next"
import MunichPersonalTrainingClientPage from "./MunichPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personal Training München | Finde deinen passenden Fitness Coach",
  description:
    "Personal Trainer in München finden ✓ Kostenloses Probetraining ✓ Alle Stadtteile ✓ Muskelaufbau, Abnehmen, Gesundheit ✓ Erfahrene Coaches für Anfänger & Fortgeschrittene",
  keywords: [
    "personal trainer münchen",
    "fitnesscoach münchen",
    "probetraining münchen",
    "rücken stärken training münchen",
    "muskelaufbau trainer münchen",
    "personal training münchen",
    "fitness coach münchen",
    "krafttraining münchen",
    "abnehmen münchen",
    "gesundheitstraining münchen",
    "haltungstraining münchen",
    "bewegungsanalyse münchen",
  ].join(", "),
  openGraph: {
    title: "Personal Training München | Finde deinen passenden Fitness Coach",
    description:
      "Personal Trainer in München finden ✓ Kostenloses Probetraining ✓ Alle Stadtteile ✓ Muskelaufbau, Abnehmen, Gesundheit ✓ Erfahrene Coaches für Anfänger & Fortgeschrittene",
    url: "https://juiceapp.com/personal-training-muenchen",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-og-image.png",
        width: 1200,
        height: 630,
        alt: "Personal Training München - Juice",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training München | Finde deinen passenden Fitness Coach",
    description:
      "Personal Trainer in München finden ✓ Kostenloses Probetraining ✓ Alle Stadtteile ✓ Muskelaufbau, Abnehmen, Gesundheit",
    images: ["/images/juice-og-image.png"],
  },
  alternates: {
    canonical: "https://juiceapp.com/personal-training-muenchen",
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

export default function PersonalTrainingMunichPage() {
  return <MunichPersonalTrainingClientPage />
}
