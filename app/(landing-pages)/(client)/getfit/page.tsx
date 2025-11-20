import type { Metadata } from "next"
import GetFitClientPage from "./GetFitClientPage"

export const metadata: Metadata = {
  title: "Get Fit - Juice",
  description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
  openGraph: {
    title: "Get Fit - Juice",
    description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
    url: "https://juiceapp.com/getfit",
    siteName: "Juice",
    images: [
      {
        url: "/images/juice-og-image.png",
        width: 1200,
        height: 630,
        alt: "Juice - Get Fit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Fit - Juice",
    description: "We will pair you with a personal trainer that knows what you need. Get early access and pick first.",
    images: ["/images/juice-og-image.png"],
  },
}

export default function GetFitPage() {
  return <GetFitClientPage />
}

