import { Metadata } from "next"
import { Suspense } from "react"
import { SharedLoading } from "@/components/shared-loading"
import MobilityTrainingClientPage from "./MobilityTrainingClientPage"

export const metadata: Metadata = {
  title: "Free Mobility Training Program - Improve Flexibility & Movement | Juice",
  description:
    "Enhance your movement quality and flexibility with our comprehensive mobility training program. Perfect for all fitness levels. Download free today.",
  keywords: [
    "mobility training",
    "flexibility program",
    "movement quality",
    "stretching routine",
    "joint mobility",
    "injury prevention",
    "free workout program",
    "fitness app",
  ],
  openGraph: {
    title: "Free Mobility Training Program - Improve Flexibility & Movement",
    description:
      "Enhance your movement quality and flexibility with our comprehensive mobility training program. Perfect for all fitness levels.",
    type: "website",
    url: "https://juice-website-mirre.vercel.app/workout-programs/free/mobility-training",
    images: [
      {
        url: "https://juice-website-mirre.vercel.app/images/mobility-training-og.jpg",
        width: 1200,
        height: 630,
        alt: "Free Mobility Training Program - Juice Fitness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mobility Training Program - Improve Flexibility & Movement",
    description:
      "Enhance your movement quality and flexibility with our comprehensive mobility training program. Perfect for all fitness levels.",
    images: ["https://juice-website-mirre.vercel.app/images/mobility-training-og.jpg"],
  },
  alternates: {
    canonical: "https://juice-website-mirre.vercel.app/workout-programs/free/mobility-training",
  },
}

export default function MobilityTrainingPage() {
  return (
    <Suspense fallback={<SharedLoading />}>
      <MobilityTrainingClientPage />
    </Suspense>
  )
}
