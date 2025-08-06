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
  openGraph: {
    title: "Personal Training Amsterdam - Vind jouw trainer",
    description:
      "Nieuw in de gym of vastgelopen? In Amsterdam vind je trainers die snappen wat werkt. Gratis proefles beschikbaar!",
    url: "https://juice-coaching.com/personal-training-amsterdam",
    siteName: "Juice Coaching",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training Amsterdam - Vind jouw trainer",
    description:
      "Nieuw in de gym of vastgelopen? In Amsterdam vind je trainers die snappen wat werkt.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://juice-coaching.com/personal-training-amsterdam",
  },
}

export default function AmsterdamPersonalTrainingPage() {
  return <AmsterdamPersonalTrainingClientPage />
}
