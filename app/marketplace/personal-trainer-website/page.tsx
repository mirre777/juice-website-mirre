import type { Metadata } from "next"
import PersonalTrainerWebsitePage from "./PersonalTrainerWebsitePage"

export const metadata: Metadata = {
  title: "Create Your Personal Trainer Website | Juice",
  description:
    "Get a professional trainer website in minutes. Mobile-optimized, booking system included, and designed to help you grow your fitness business.",
  keywords: ["personal trainer website", "fitness website", "trainer profile", "fitness business", "online training"],
  openGraph: {
    title: "Create Your Personal Trainer Website | Juice",
    description: "Get a professional trainer website in minutes. Mobile-optimized, booking system included.",
    type: "website",
  },
}

export default function Page() {
  return <PersonalTrainerWebsitePage />
}
