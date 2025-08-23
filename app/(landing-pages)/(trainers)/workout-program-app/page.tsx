import type { Metadata } from "next"
import { WorkoutProgramAppClientPage } from "./WorkoutProgramAppClientPage"

export const metadata: Metadata = {
  title: "Workout Program App - Juice Fitness",
  description:
    "Kill the hassle. Keep the gains. Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every PR—all in one easy-to-use platform.",
  alternates: {
    canonical: "/workout-program-app",
  },
  openGraph: {
    title: "Workout Program App - Juice Fitness",
    description:
      "Kill the hassle. Keep the gains. Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every PR—all in one easy-to-use platform.",
    url: "/workout-program-app",
    siteName: "Juice Fitness",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Workout Program App - Juice Fitness",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function WorkoutProgramApp() {
  return <WorkoutProgramAppClientPage />
}
