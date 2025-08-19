import GetClientsClientPage from "./GetClientsClientPage"

export const metadata = {
  title: "Get Clients | Juice Marketplace for Personal Trainers",
  description:
    "Join Juice's elite trainer marketplace and platform for personal trainers. Discover how to get more clients and expand your fitness business.",
  openGraph: {
    images: "/images/og-feature-graphic.png", // Specific image for getclients
  },
  alternates: {
    canonical: "/getclients",
  },
}

export default function GetClientsPage() {
  return <GetClientsClientPage />
}
