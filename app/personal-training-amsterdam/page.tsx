import type { Metadata } from "next"
import AmsterdamPersonalTrainingClientPage from "./AmsterdamPersonalTrainingClientPage"

export const metadata: Metadata = {
  title: "Personal Training Amsterdam - Vind jouw trainer | Juice",
  description:
    "Personal training in Amsterdam: Vind de perfecte fitness-coach voor jou. Gratis proefles, alle stadsdelen, spiermassa, afvallen & gezondheid. Nu trainer vinden!",
  keywords: [
    "personal trainer amsterdam",
    "fitness coach amsterdam",
    "proefles amsterdam",
    "spiermassa trainer amsterdam",
    "houding verbeteren training amsterdam",
    "personal training centrum",
    "fitness begeleiding amsterdam",
    "krachttraining amsterdam",
  ],
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-amsterdam",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AmsterdamPersonalTrainingPage() {
  return <AmsterdamPersonalTrainingClientPage />
}
