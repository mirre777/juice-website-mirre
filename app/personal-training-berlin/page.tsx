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
  openGraph: {
    title: "Personal Training Berlin - Dein Coach wartet",
    description:
      "Ob Anfänger oder im Gym feststeckst - in Berlin findest du Trainer*innen, die wissen, wie man Fortschritte macht. Gratis Probetraining verfügbar!",
    url: "https://juice-coaching.com/personal-training-berlin",
    siteName: "Juice Coaching",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training Berlin - Dein Coach wartet",
    description:
      "Ob Anfänger oder im Gym feststeckst - in Berlin findest du Trainer*innen, die wissen, wie man Fortschritte macht.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-berlin",
  },
}

export default function BerlinPersonalTrainingPage() {
  return <BerlinPersonalTrainingClientPage />
}
