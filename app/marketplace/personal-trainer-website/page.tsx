import type { Metadata } from "next"
import PersonalTrainerWebsitePage from "./PersonalTrainerWebsitePage"

export const metadata: Metadata = {
  title: "Create Your Personal Trainer Website | Juice",
  description:
    "Get a professional personal trainer website in minutes. Mobile-optimized, booking system included, and designed to help you grow your fitness business.",
  keywords: "personal trainer website, fitness website, trainer profile, online booking, fitness business",
}

export default function Page() {
  return <PersonalTrainerWebsitePage />
}
