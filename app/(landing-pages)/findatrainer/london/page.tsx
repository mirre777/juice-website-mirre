import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, extractDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Find a Personal Trainer in London | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in London. Connect with verified fitness professionals in Westminster, Camden, Islington, and more. Find your perfect trainer today.",
  keywords: [
    "personal trainer London",
    "fitness trainer London",
    "personal training London",
    "certified trainer London",
    "trainer directory London",
    "fitness coach London",
    "personal trainer Westminster",
    "trainer London-Camden",
    "personal trainer Islington",
    "trainer Hackney",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/london",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/findatrainer/london",
    title: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in London. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-trainer-directory-london.jpg",
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory London - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description: "Discover certified personal trainers in London. Find your perfect trainer today.",
    images: ["/images/og-trainer-directory-london.jpg"],
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

export default async function LondonTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("London")
  const districts = extractDistricts(trainers)

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/london`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Find a Personal Trainer in London | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in London. Connect with verified fitness professionals in Westminster, Camden, Islington, and more. Find your perfect trainer today.",
    about: "Personal Training Directory, Fitness Coaches, London", // helps topic classification for AI
    keywords: [
      "personal trainer London",
      "fitness trainer London",
      "personal training London",
      "certified trainer London",
      "trainer directory London",
      "fitness coach London",
      "personal trainer Westminster",
      "trainer London-Camden",
      "personal trainer Islington",
      "trainer Hackney",
    ].join(", "), // semantic keywords
    speakable: {
      // for AI voice/summarization models
      "@type": "SpeakableSpecification",
      xpath: ["/html/head/title", "/html/body/main/h1", "/html/body/main/p[1]"],
    },
    publisher: {
      "@type": "Organization",
      name: "Juice Fitness",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/juiceNewLogoPrime.png`,
      },
    },
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/og-trainer-directory-london.jpg`,
      width: 1200,
      height: 630,
      alt: "Personal Trainer Directory London - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in London",
      description: "Directory of certified personal trainers in London",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="London" districts={districts} trainers={trainers} />
      <Footer />
    </main>
    </>
  )
}

