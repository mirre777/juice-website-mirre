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
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-koebenhavn",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CopenhagenPersonalTrainingPage() {
  return <CopenhagenPersonalTrainingClientPage />
}
