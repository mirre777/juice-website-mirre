import type { Metadata } from "next"
import CopenhagenPersonalTrainingClientPage from "./CopenhagenPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personlig træning København - Find din træner | Juice",
  description:
    "Personlig træning i København: Find den perfekte fitness-træner til dig. Gratis prøvetime, alle bydele, muskelopbygning, vægttab & sundhed. Find træner nu!",
  keywords: [
    "personlig træner københavn",
    "fitness coach københavn",
    "gratis prøvetime træning københavn",
    "muskelopbygning træner københavn",
    "holdning forbedring træning københavn",
    "personlig træning center",
    "fitness vejledning københavn",
    "styrketræning københavn",
  ],
  openGraph: {
    title: "Personlig træning København - Find din træner",
    description:
      "Første gang i fitness eller fastlåst i din træning? I København finder du trænere, der ved hvordan det gøres. Gratis prøvetime tilgængelig!",
    url: "https://juice-coaching.com/personal-training-koebenhavn",
    siteName: "Juice Coaching",
    locale: "da_DK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personlig træning København - Find din træner",
    description:
      "Første gang i fitness eller fastlåst i din træning? I København finder du trænere, der ved hvordan det gøres.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-koebenhavn",
  },
}

export default function CopenhagenPersonalTrainingPage() {
  return <CopenhagenPersonalTrainingClientPage />
}
