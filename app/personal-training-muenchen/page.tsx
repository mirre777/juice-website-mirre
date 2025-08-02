import type { Metadata } from "next"
import MunichPersonalTrainingClientPage from "./MunichPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personal Training München - Finde deinen passenden Coach | Juice",
  description:
    "Personal Trainer in München finden ✓ Gratis Probetraining ✓ Alle Stadtteile ✓ Anfänger bis Fortgeschrittene ✓ Muskelaufbau, Abnehmen, Gesundheit",
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
  ],
  openGraph: {
    title: "Personal Training München - Finde deinen passenden Coach",
    description:
      "Personal Trainer in München finden ✓ Gratis Probetraining ✓ Alle Stadtteile ✓ Anfänger bis Fortgeschrittene",
    url: "https://juice-website.vercel.app/personal-training-muenchen",
    siteName: "Juice",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/images/munich-personal-training-og.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Training München - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training München - Finde deinen passenden Coach",
    description: "Personal Trainer in München finden ✓ Gratis Probetraining ✓ Alle Stadtteile",
    images: ["/images/munich-personal-training-og.jpg"],
  },
  alternates: {
    canonical: "https://juice-website.vercel.app/personal-training-muenchen",
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

export default function MunichPersonalTrainingPage() {
  return <MunichPersonalTrainingClientPage />
}
