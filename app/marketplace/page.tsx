import MarketplaceClientPage from "./MarketplaceClientPage"

export const metadata = {
  title: "Juice Marketplace | Connect with Clients & Grow Your Fitness Business",
  description:
    "Juice is the elite trainer marketplace and platform for personal trainers. Discover how to get more clients and expand your fitness business.",
  openGraph: {
    images: "/images/og-feature-graphic.png", // Specific image for marketplace
  },
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
