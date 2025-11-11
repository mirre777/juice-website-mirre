// page.tsx

import type { Metadata } from "next"
import JuiceRaffleWeeklyGoalClientPage from "./JuiceRaffleWeeklyGoalClientPage"

export const metadata: Metadata = {
  title: "Juice Raffle – Win Free Personal Training | Juice",
  description:
    "Win a free month of personal training — just by working out. Download the app, set a weekly goal (min. 3 sessions), log your workouts, and hit your goal 4 weeks in a row to enter.",
  keywords: [
    "juice raffle",
    "free personal training",
    "weekly goal",
    "workout tracking",
    "gym challenge",
    "fitness motivation",
    "workout streak",
    "fitness rewards",
  ],
  openGraph: {
    title: "Juice Raffle – Win Free Personal Training",
    description:
      "Hit your weekly goal 4 weeks in a row to enter the Juice raffle and win a free month of personal training.",
    url: "/juice-raffle-win-free-personal-training",
    siteName: "Juice",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/juice-raffle-form-check.png",
        width: 1200,
        height: 630,
        alt: "Juice Raffle – Win Free Personal Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice Raffle – Win Free Personal Training",
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
