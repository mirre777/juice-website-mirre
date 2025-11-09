import type { Metadata } from "next"
import AltTrainerHomePage from "./AltTrainerHomePage"

export const metadata: Metadata = {
  title: "Juice - Personal Training Software for Coaches | Get More Clients",
  description:
    "The complete personal training platform for coaches. Manage clients, create workout programs, track progress, and grow your fitness business. Start your free trial today.",
  keywords:
    "personal training software, fitness coaching app, client management, workout programs, personal trainer tools, fitness business",
  openGraph: {
    title: "Juice - Personal Training Software for Coaches",
    description:
      "The complete personal training platform for coaches. Manage clients, create workout programs, track progress, and grow your fitness business.",
    type: "website",
    url: "https://juice.fitness/trainers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice - Personal Training Software for Coaches",
    description:
      "The complete personal training platform for coaches. Manage clients, create workout programs, track progress, and grow your fitness business.",
  },
  alternates: {
    canonical: "https://juice.fitness/trainers",
  },
}

export default function TrainersPage() {
  return <AltTrainerHomePage />
}

