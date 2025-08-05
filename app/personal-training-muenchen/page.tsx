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
  openGraph: {
    title: "Personal Training München - Finde deinen passenden Coach",
    description:
      "Egal ob Anfänger oder Fortgeschrittener - in München gibt's Trainer*innen, die dich verstehen und weiterbringen. Gratis Probetraining verfügbar!",
    url: "https://juice-coaching.com/personal-training-muenchen",
    siteName: "Juice Coaching",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training München - Finde deinen passenden Coach",
    description:
      "Egal ob Anfänger oder Fortgeschrittener - in München gibt's Trainer*innen, die dich verstehen und weiterbringen.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-muenchen",
  },
}

export default function MunichPersonalTrainingPage() {
  return <MunichPersonalTrainingClientPage />
}
