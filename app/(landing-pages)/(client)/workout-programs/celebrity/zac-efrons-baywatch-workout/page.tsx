import type { Metadata } from "next"
import ZacEfronBaywatchClientPage from "./ZacEfronBaywatchClientPage"

export const metadata: Metadata = {
  title: "Zac Efron's Baywatch Workout Routine - Beach Body Training | Juice",
  description:
    "Get the Baywatch physique with Zac Efron's intense workout routine. Features beach body training, lean muscle building, and lifeguard-level conditioning for maximum results.",
  keywords: [
    "zac efron baywatch workout",
    "zac efron workout routine",
    "baywatch workout program",
    "celebrity workout program",
    "beach body training program",
    "lean muscle building",
    "lifeguard training",
    "beach physique",
    "zac efron training",
    "celebrity trainer program",
    "beach bodybuilding",
    "intense workout routine",
    "lifeguard strength training",
    "beach athletic performance",
  ],
  openGraph: {
    title: "Zac Efron's Baywatch Workout Routine - Celebrity Training | Juice",
    description:
      "Get the Baywatch physique with Zac Efron's intense workout routine. Features beach body training, lean muscle building, and lifeguard-level conditioning.",
    url: "/workout-programs/celebrity/zac-efrons-baywatch-workout",
    siteName: "Juice",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Zac Efron's Baywatch Workout Routine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zac Efron's Baywatch Workout Routine - Celebrity Training",
    description:
      "Get the Baywatch physique with Zac Efron's intense workout routine. Features beach body training, lean muscle building, and lifeguard-level conditioning.",
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
    canonical: "/workout-programs/celebrity/zac-efrons-baywatch-workout",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function ZacEfronBaywatchPage() {
  return <ZacEfronBaywatchClientPage />
}
