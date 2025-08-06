import type { Metadata } from "next"
import MunichPersonalTrainingClientPage from "./MunichPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personal Training München - Finde deinen passenden Coach | Juice",
  description:
    "Personal Training in München: Finde den perfekten Fitness-Coach für dich. Gratis Probetraining, alle Stadtteile, Muskelaufbau, Abnehmen & Gesundheit. Jetzt Trainer finden!",
  keywords: [
    "personal trainer münchen",
    "fitnesscoach münchen",
    "probetraining münchen",
    "muskelaufbau trainer münchen",
    "rücken stärken training münchen",
    "personal training schwabing",
    "fitness coach maxvorstadt",
    "krafttraining münchen",
  ],
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-muenchen",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MunichPersonalTrainingPage() {
  return <MunichPersonalTrainingClientPage />
}
