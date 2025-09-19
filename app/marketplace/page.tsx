import type { Metadata } from "next"
import MarketplaceClientPage from "./MarketplaceClientPage"

export const metadata: Metadata = {
  title: "Personal Trainer Marketplace | Find Clients Online | Juice",
  description:
    "Join Juice's curated trainer marketplace and get more clients. Connect with motivated fitness enthusiasts looking for personal trainers—online & local across Europe.",
  keywords: [
    "personal trainer marketplace",
    "find personal training clients",
    "fitness trainer directory",
    "online personal trainer platform",
    "personal training leads",
    "fitness coaching marketplace",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/marketplace",
    title: "Personal Trainer Marketplace | Find Clients Online",
    description:
      "Join our curated trainer marketplace and get more clients. Connect with motivated fitness enthusiasts looking for personal trainers.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Personal Trainer Marketplace - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Trainer Marketplace | Find Clients Online",
    description:
      "Join our curated trainer marketplace and connect with motivated clients looking for personal trainers.",
    images: ["/images/og-feature-graphic.png"],
    creator: "@juice_app",
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
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
