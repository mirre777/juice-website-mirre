import type { Metadata } from "next"
import GratisWorkoutAppClientPage from "./GratisWorkoutAppClientPage"

export const metadata: Metadata = {
  title: "Gratis Workout App met Personal Trainer | Train Thuis of Buiten | Juice",
  description:
    "Download de gratis workout app en train met een personal trainer aan huis of zelfstandig. Geen sportschool nodig, betaal per sessie. Start vandaag met fitness thuis!",
  keywords: [
    "gratis workout app",
    "personal trainer app",
    "fitness app gratis",
    "thuis trainen app",
    "workout app met trainer",
    "personal trainer aan huis",
    "fitness app Nederland",
    "gratis fitness app",
    "workout app Nederlands",
    "personal training zonder sportschool",
    "fitness trainer online",
    "gratis sport app",
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
    canonical: "/gratis-workout-app-met-trainer",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/gratis-workout-app-met-trainer",
    title: "Gratis Workout App met Personal Trainer | Train Thuis of Buiten",
    description:
      "Download de gratis workout app en train met een personal trainer aan huis of zelfstandig. Geen sportschool nodig, betaal per sessie.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Gratis Workout App - Personal Training Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gratis Workout App met Personal Trainer | Train Thuis of Buiten",
    description:
      "Download de gratis workout app en train met een personal trainer aan huis of zelfstandig. Geen sportschool nodig!",
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

export default function GratisWorkoutAppPage() {
  return <GratisWorkoutAppClientPage />
}
