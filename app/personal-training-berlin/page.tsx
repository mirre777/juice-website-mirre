import type { Metadata } from "next"
import BerlinPersonalTrainingClientPage from "./BerlinPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personal Training Berlin - Dein Coach wartet | Juice",
  description:
    "Personal Training in Berlin: Finde den perfekten Fitness-Coach für dich. Gratis Probetraining, alle Bezirke, Muskelaufbau, Abnehmen & Gesundheit. Jetzt Trainer finden!",
  keywords: [
    "personal trainer berlin",
    "fitnesscoach berlin",
    "probetraining berlin",
    "rückentraining berlin",
    "muskelaufbau berlin",
    "personal training mitte",
    "fitness coach kreuzberg",
    "krafttraining berlin",
  ],
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-berlin",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BerlinPersonalTrainingPage() {
  return <BerlinPersonalTrainingClientPage />
}
