import GetClientsClientPage from "./GetClientsClientPage"

export const metadata = {
  title: "Get More Clients | Elite Personal Trainer Marketplace - Juice",
  description:
    "Join Juice's curated marketplace for elite personal trainers. Get qualified leads, streamlined client acquisition, and grow your fitness business with our proven 3-step process.",
  keywords:
    "personal trainer marketplace, get fitness clients, trainer leads, fitness business growth, elite trainers, qualified clients",
  openGraph: {
    title: "Get More Clients | Elite Personal Trainer Marketplace - Juice",
    description:
      "Join Juice's curated marketplace for elite personal trainers. Get qualified leads and grow your fitness business.",
    images: "/images/og-feature-graphic.png",
  },
  alternates: {
    canonical: "/getclients",
  },
}

export default function GetClientsPage() {
  return <GetClientsClientPage />
}
