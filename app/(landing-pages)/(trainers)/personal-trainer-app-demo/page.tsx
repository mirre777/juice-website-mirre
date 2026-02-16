import type { Metadata } from "next"
import { PersonalTrainerAppClientPage } from "./PersonalTrainerAppClientPage"

export const metadata: Metadata = {
  title: "Personal Trainer App - Juice Fitness",
  description:
    "Kill the hassle. Keep the gains. Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every PR—all in one easy-to-use platform.",
  alternates: {
    canonical: "/personal-trainer-app-demo",
  },
  openGraph: {
    title: "Personal Trainer App - Juice Fitness",
    description:
      "Kill the hassle. Keep the gains. Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every PR—all in one easy-to-use platform.",
    url: "/personal-trainer-app-demo",
    siteName: "Juice Fitness",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Trainer App - Juice Fitness",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function PersonalTrainerApp() {
  return <PersonalTrainerAppClientPage />
}
