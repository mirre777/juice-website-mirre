import type { Metadata } from "next"
import ClientHomePage from "./ClientHomePage"

export const metadata: Metadata = {
  title: "Juice - Best Workout Logging App for Fitness Enthusiasts",
  description:
    "Track your workouts, log progress, and achieve your fitness goals with Juice. The simplest workout logging app for clients working with personal trainers.",
  keywords:
    "workout logging app, fitness tracking, workout tracker, personal training app, fitness app, workout progress",
  openGraph: {
    title: "Juice - Best Workout Logging App for Fitness Enthusiasts",
    description:
      "Track your workouts, log progress, and achieve your fitness goals with Juice. The simplest workout logging app for clients.",
    type: "website",
    url: "https://juice.fitness/for-clients",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juice - Best Workout Logging App for Fitness Enthusiasts",
    description:
      "Track your workouts, log progress, and achieve your fitness goals with Juice. The simplest workout logging app for clients.",
  },
  alternates: {
    canonical: "https://juice.fitness/for-clients",
  },
}

export default function ClientsPage() {
  return <ClientHomePage />
}
