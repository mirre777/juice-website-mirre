import type { Metadata } from "next"
import HundredTrainersClientPage from "./HundredTrainersClientPage"

export const metadata: Metadata = {
  title: "First 100 Trainers - Juice",
  description:
    "Be among the first 100 trainers to join Juice's exclusive network. Get priority access to high-quality clients who need your expertise.",
  keywords: ["fitness trainer", "personal trainer", "client matching", "fitness coaching", "exclusive network"],
  openGraph: {
    title: "First 100 Trainers - Juice",
    description:
      "Be among the first 100 trainers to join Juice's exclusive network. Get priority access to high-quality clients who need your expertise.",
    type: "website",
    url: "https://juiceapp.com/100trainers",
    siteName: "Juice",
    images: [
      {
        url: "https://juiceapp.com/images/100-trainers-grid-social.png",
        width: 1200,
        height: 630,
        alt: "100 trainer spots visualization - 66 spots taken, 34 remaining",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "First 100 Trainers - Juice",
    description:
      "Be among the first 100 trainers to join Juice's exclusive network. Get priority access to high-quality clients who need your expertise.",
    images: ["https://juiceapp.com/images/100-trainers-grid-social.png"],
    creator: "@juiceapp",
  },
}

export default function HundredTrainersPage() {
  return <HundredTrainersClientPage />
}
