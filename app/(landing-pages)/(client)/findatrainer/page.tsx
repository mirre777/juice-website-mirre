import type { Metadata } from "next"
import FindATrainerClientPage from "./FindATrainerClientPage"

export const metadata: Metadata = {
  title: "Find a Trainer - Juice",
  description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
  openGraph: {
    title: "Find a Trainer - Juice",
    description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
    url: "https://juiceapp.com/findatrainer",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-og-image.png",
        width: 1200,
        height: 630,
        alt: "Juice - Find a Trainer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Trainer - Juice",
    description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
    images: ["/images/juice-og-image.png"],
  },
}

export default function FindATrainerPage() {
  return <FindATrainerClientPage />
}
