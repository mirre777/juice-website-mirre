import type { Metadata } from "next"
import DownloadJuiceAppClientPage from "./DownloadJuiceAppClientPage"

export const metadata: Metadata = {
  title: "Download Juice - Free Fitness App | Get Started Today",
  description:
    "Download the Juice fitness app for free. Track workouts, find trainers, and achieve your fitness goals with our comprehensive fitness platform.",
  alternates: {
    canonical: "/download-juice-app",
  },
  openGraph: {
    title: "Download Juice - Free Fitness App | Get Started Today",
    description:
      "Download the Juice fitness app for free. Track workouts, find trainers, and achieve your fitness goals with our comprehensive fitness platform.",
    url: "/download-juice-app",
    siteName: "Juice",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Juice - Download Free Fitness App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Juice - Free Fitness App | Get Started Today",
    description:
      "Download the Juice fitness app for free. Track workouts, find trainers, and achieve your fitness goals with our comprehensive fitness platform.",
    images: ["/og-image.png"],
  },
}

export default function DownloadJuiceAppPage() {
  return <DownloadJuiceAppClientPage />
}
