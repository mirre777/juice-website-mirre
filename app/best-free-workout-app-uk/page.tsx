import type { Metadata } from "next"
import BestFreeWorkoutAppClientPage from "./BestFreeWorkoutAppClientPage"

export const metadata: Metadata = {
  title: "Best Free Workout App UK – Track, Plan and Get Stronger | Juice",
  description:
    "Looking for a way to train smarter without paying a subscription? Our free workout app helps you log your workouts, follow a personal workout planner, and stay motivated.",
  keywords: [
    "best free workout app uk",
    "workout app",
    "best workout app",
    "workout planner",
    "gym workout planner",
    "free workout planner",
    "good workout apps",
    "good workout apps free",
    "best fitness planner app",
    "app with workouts",
    "best app to exercise",
    "best free fitness app",
    "free workout app uk",
  ],
  openGraph: {
    title: "Best Free Workout App UK – Track, Plan and Get Stronger",
    description:
      "Looking for a way to train smarter without paying a subscription? Our free workout app helps you log your workouts, follow a personal workout planner, and stay motivated.",
    url: "/best-free-workout-app-uk",
    siteName: "Juice",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Best Free Workout App UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free Workout App UK – Track, Plan and Get Stronger",
    description:
      "Looking for a way to train smarter without paying a subscription? Our free workout app helps you log your workouts, follow a personal workout planner, and stay motivated.",
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
    canonical: "/best-free-workout-app-uk",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function BestFreeWorkoutAppUKPage() {
  return <BestFreeWorkoutAppClientPage />
}
