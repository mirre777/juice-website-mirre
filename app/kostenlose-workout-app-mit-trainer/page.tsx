import type { Metadata } from "next"
import KostenloseWorkoutAppClientPage from "./KostenloseWorkoutAppClientPage"

export const metadata: Metadata = {
  title: "Kostenlose Workout App mit Personal Trainer | Zuhause Trainieren | Juice",
  description:
    "Lade die kostenlose Workout App herunter und trainiere mit einem Personal Trainer zu Hause oder selbstständig. Kein Fitnessstudio nötig, bezahle pro Session. Starte heute mit Fitness zuhause!",
  keywords: [
    "kostenlose workout app",
    "personal trainer app",
    "fitness app kostenlos",
    "zuhause trainieren app",
    "workout app mit trainer",
    "personal trainer zu hause",
    "fitness app Deutschland",
    "kostenlose fitness app",
    "workout app deutsch",
    "personal training ohne fitnessstudio",
    "fitness trainer online",
    "kostenlose sport app",
    "heimtraining app",
    "fitness app DACH",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://juice-website-mirre.vercel.app"),
  alternates: {
    canonical: "/kostenlose-workout-app-mit-trainer",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/kostenlose-workout-app-mit-trainer",
    title: "Kostenlose Workout App mit Personal Trainer | Zuhause Trainieren",
    description:
      "Lade die kostenlose Workout App herunter und trainiere mit einem Personal Trainer zu Hause oder selbstständig. Kein Fitnessstudio nötig, bezahle pro Session.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Kostenlose Workout App - Personal Training Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kostenlose Workout App mit Personal Trainer | Zuhause Trainieren",
    description:
      "Lade die kostenlose Workout App herunter und trainiere mit einem Personal Trainer zu Hause oder selbstständig. Kein Fitnessstudio nötig!",
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

export default function KostenloseWorkoutAppPage() {
  return <KostenloseWorkoutAppClientPage />
}
