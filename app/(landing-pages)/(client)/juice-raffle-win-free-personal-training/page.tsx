import type { Metadata } from "next"
import JuiceRaffleWeeklyGoalClientPage from "./JuiceRaffleWeeklyGoalClientPage"

export const metadata: Metadata = {
  title: "Juice Raffle – Hit Your Weekly Goal | Juice",
  description:
    "Join the Juice raffle by hitting your weekly goal. Track workouts, stay consistent, and enter to win once you complete your weekly target.",
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
    title: "Juice Raffle – Hit Your Weekly Goal",
    description:
      "Hit your weekly goal in the Juice app to enter the raffle. Stay consistent, track progress, and win.",
    url: "/juice-raffle-hit-weekly-goal",
    siteName: "Juice",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice raffle weekly goal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Raffle – Hit Your Weekly Goal",
    description:
      "Track your training, hit the weekly goal, and enter the raffle in the Juice app.",
    images: ["/images/og-feature-graphic.png"],
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
    canonical: "/juice-raffle-hit-weekly-goal",
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
