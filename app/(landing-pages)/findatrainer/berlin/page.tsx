import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, extractDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in Berlin. Connect with verified fitness professionals in Mitte, Friedrichshain, Kreuzberg, and more. Find your perfect trainer today.",
  keywords: [
    "personal trainer Berlin",
    "fitness trainer Berlin",
    "personal training Berlin",
    "certified trainer Berlin",
    "trainer directory Berlin",
    "fitness coach Berlin",
    "personal trainer Mitte",
    "trainer Berlin-Mitte",
    "personal trainer Friedrichshain",
    "trainer Kreuzberg",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/berlin",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/findatrainer/berlin",
    title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Berlin. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-trainer-directory-berlin.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Berlin - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in Berlin | Verified Fitness Coaches",
    description: "Discover certified personal trainers in Berlin. Find your perfect trainer today.",
    images: ["/images/og-trainer-directory-berlin.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function BerlinTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("Berlin")
  const districts = extractDistricts(trainers)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="Berlin" districts={districts} trainers={trainers} />
      <Footer />
    </main>
  )
}

