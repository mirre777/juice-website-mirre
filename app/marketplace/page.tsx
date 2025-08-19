import MarketplaceClientPage from "./MarketplaceClientPage"

export const metadata = {
  title: "Personal Trainer Marketplace | Find Clients Online",
  description:
    "Join Juice's trainer marketplace and get more clients. A curated fitness platform where personal trainers connect with motivated clients—online & local.",
  openGraph: {
    images: "/images/og-feature-graphic.png", // Specific image for marketplace
  },
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
