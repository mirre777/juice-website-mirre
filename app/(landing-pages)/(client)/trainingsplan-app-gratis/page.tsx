import type { Metadata } from "next"
import TrainingsplanAppClientPage from "./TrainingsplanAppClientPage"

export const metadata: Metadata = {
  title: "Kostenlose Fitness App für dein Training zuhause | Juice",
  description:
    "Deine Workouts, dein Plan, kein Abo. Kostenlose Fitness App mit Übungen für jedes Level. Nutze die App online oder offline verfügbar.",
  keywords: [
    "kostenlose fitness app",
    "trainingsplan app",
    "fitness app gratis",
    "workout app kostenlos",
    "training zuhause app",
    "fitness online app",
    "trainingsplan erstellen",
    "workout ohne abo",
    "fitness app deutschland",
    "kostenlose sport app",
    "heimtraining app",
    "fitness app DACH",
    "training app offline",
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
    canonical: "/trainingsplan-app-gratis",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/trainingsplan-app-gratis",
    title: "Kostenlose Fitness App für dein Training zuhause",
    description: "Deine Workouts, dein Plan, kein Abo. Kostenlose Fitness App mit Übungen für jedes Level.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Kostenlose Fitness App - Training zuhause ohne Abo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kostenlose Fitness App für dein Training zuhause",
    description: "Deine Workouts, dein Plan, kein Abo. Kostenlose Fitness App mit Übungen für jedes Level.",
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

export default function TrainingsplanAppGratisPage() {
  return <TrainingsplanAppClientPage />
}
