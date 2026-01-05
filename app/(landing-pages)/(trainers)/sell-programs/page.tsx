import type { Metadata } from "next"
import SellProgramsClientPage from "./SellProgramsClientPage"

export const metadata: Metadata = {
  title: "Sell Your Workout Programs - Juice Marketplace",
  description:
    "Turn your expertise into income. Join Juice's marketplace and reach thousands of clients looking for professional workout programs. Start selling today.",
  keywords: [
    "sell workout programs",
    "fitness program marketplace",
    "personal trainer programs",
    "workout program creator",
    "fitness content creator",
    "sell fitness programs online",
  ],
  openGraph: {
    title: "Sell Your Workout Programs - Juice Marketplace",
    description:
      "Turn your expertise into income. Join Juice's marketplace and reach thousands of clients looking for professional workout programs.",
    type: "website",
    url: "https://juiceapp.com/sell-programs",
    siteName: "Juice",
    images: [
      {
        url: "https://juiceapp.com/images/sell-programs-social.png",
        width: 1200,
        height: 630,
        alt: "Sell your workout programs on Juice marketplace",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Workout Programs - Juice Marketplace",
    description:
      "Turn your expertise into income. Join Juice's marketplace and reach thousands of clients looking for professional workout programs.",
    images: ["https://juiceapp.com/images/sell-programs-social.png"],
    creator: "@juiceapp",
  },
}

export default function SellProgramsPage() {
  return <SellProgramsClientPage />
}






