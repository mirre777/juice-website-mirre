import type { Metadata } from "next"
import GratisFitnessAppClientPage from "./GratisFitnessAppClientPage"

export const metadata: Metadata = {
  title: "Gratis fitness app i Danmark – Træn når og hvor du vil | Juice",
  description:
    "Vil du i form uden at betale abonnement? Vores gratis fitness app giver dig træningsprogrammer, tracking og mulighed for at dele din træning med venner. Perfekt til både hjemmetræning og fitnesscenter.",
  keywords: [
    "gratis fitness app",
    "fitness app danmark",
    "træningsprogram app",
    "løbe app",
    "cykel app",
    "tracking app",
    "fitness app med målinger",
    "booking app fitness",
    "community fitness app",
    "gratis træningsprogram",
    "fitness app offline",
    "træning app danmark",
    "fitness tracking danmark",
  ],
  openGraph: {
    title: "Gratis fitness app i Danmark – Træn når og hvor du vil",
    description:
      "Vil du i form uden at betale abonnement? Vores gratis fitness app giver dig træningsprogrammer, tracking og mulighed for at dele din træning med venner.",
    url: "/gratis-fitness-app-danmark",
    siteName: "Juice",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Gratis fitness app i Danmark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gratis fitness app i Danmark – Træn når og hvor du vil",
    description:
      "Vil du i form uden at betale abonnement? Vores gratis fitness app giver dig træningsprogrammer, tracking og mulighed for at dele din træning med venner.",
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
    canonical: "/gratis-fitness-app-danmark",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function GratisFitnessAppDanmarkPage() {
  return <GratisFitnessAppClientPage />
}
