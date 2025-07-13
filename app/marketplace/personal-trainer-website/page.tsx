import type { Metadata } from "next"
import PersonalTrainerWebsitePage from "./PersonalTrainerWebsitePage"

export const metadata: Metadata = {
  title: "Create Your Personal Trainer Website | Juice",
  description:
    "Get a professional, mobile-optimized personal trainer website in minutes. Showcase your services, accept bookings, and grow your fitness business.",
  keywords: "personal trainer website, fitness website, trainer marketing, online booking, fitness business",
}

export default function Page() {
  return <PersonalTrainerWebsitePage />
}
