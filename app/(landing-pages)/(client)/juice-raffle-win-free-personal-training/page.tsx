import type { Metadata } from "next"
import JuiceRaffleWeeklyGoalClientPage from "./JuiceRaffleWeeklyGoalClientPage"

export const metadata: Metadata = {
  title: "Juice Raffle – Win a Free Form Check | Juice",
  description:
    "Join the Juice raffle by hitting your weekly goal. Track workouts, stay consistent, and enter to win a free form check once you complete your weekly target.",
  keywords: [
    "juice raffle",
    "weekly goal",
    "fitness challenge",
    "workout tracking",
    "consistency challenge",
    "fitness motivation",
    "workout streak",
    "fitness rewards",
  ],
  openGraph: {
    title: "Juice Raffle – Win a Free Form Check",
    description:
      "Hit your weekly goal in the Juice app to enter the raffle. Stay consistent, track progress, and win a free form check.",
    url: "/juice-raffle-win-free-personal-training",
    siteName: "Juice",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/juice-raffle-form-check.png",
        width: 1200,
        height: 630,
        alt: "Juice Raffle – Win a Free Form Check",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Raffle – Win a Free Form Check",
    description:
      "Track your training, hit the weekly goal, and enter the raffle in the Juice app.",
    images: ["/images/juice-raffle-form-check.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/juice-raffle-win-free-personal-training",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function JuiceRaffleWeeklyGoalPage() {
  return <JuiceRaffleWeeklyGoalClientPage />
}
