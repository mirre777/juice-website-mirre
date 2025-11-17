import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"

export const dynamic = 'force-dynamic'

const ogImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/vienna%20city%20church.jpg"

export const metadata: Metadata = {
  title: "Find a Personal Trainer in Vienna | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in Vienna. Connect with verified fitness professionals in Innere Stadt, Leopoldstadt, Landstraße, and more. Find your perfect trainer today.",
  keywords: [
    "personal trainer Vienna",
    "fitness trainer Vienna",
    "personal training Vienna",
    "certified trainer Vienna",
    "trainer directory Vienna",
    "personal trainer kosten",
    "personal trainer preise",
    "fitness coach Vienna",
    "personal trainer Innere Stadt",
    "trainer Vienna-Leopoldstadt",
    "personal trainer Landstraße",
    "trainer Wieden",
    "personal trainer Margareten",
    "trainer Mariahilf",
    "personal trainer Neubau",
    "trainer Josefstadt",
    "personal trainer Alsergrund",
    "trainer Favoriten",
    "personal trainer Simmering",
    "trainer Meidling",
    "personal trainer Hietzing",
    "trainer Penzing",
    "personal trainer Rudolfsheim-Fünfhaus",
    "trainer Ottakring",
    "personal trainer Hernals",
    "trainer Währing",
    "personal trainer Döbling",
    "trainer Brigittenau",
    "personal trainer Floridsdorf",
    "trainer Donaustadt",
    "personal trainer Liesing",
    "Personal Trainer Wien",
    "Fitness Trainer Wien",
    "Personal Training Wien",
    "zertifizierter Trainer Wien",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/vienna",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/findatrainer/vienna",
    title: "Find a Personal Trainer in Vienna | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Vienna. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Vienna - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in Vienna | Verified Fitness Coaches",
    description: "Discover certified personal trainers in Vienna. Find your perfect trainer today.",
    images: [ogImageUrl],
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

export default async function ViennaTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("Vienna")
  const districts = getCityDistricts("Vienna")

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/vienna`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Find a Personal Trainer in Vienna | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Vienna. Connect with verified fitness professionals in Innere Stadt, Leopoldstadt, Landstraße, and more. Find your perfect trainer today.",
    about: "Personal Training Directory, Fitness Coaches, Vienna", // helps topic classification for AI
    keywords: [
      "personal trainer Vienna",
      "fitness trainer Vienna",
      "personal training Vienna",
      "certified trainer Vienna",
      "trainer directory Vienna",
      "fitness coach Vienna",
      "personal trainer Innere Stadt",
      "trainer Vienna-Leopoldstadt",
      "personal trainer Landstraße",
      "trainer Wieden",
      "personal trainer Margareten",
      "trainer Mariahilf",
      "personal trainer Neubau",
      "trainer Josefstadt",
      "personal trainer Alsergrund",
      "trainer Favoriten",
      "personal trainer Simmering",
      "trainer Meidling",
      "personal trainer Hietzing",
      "trainer Penzing",
      "personal trainer Rudolfsheim-Fünfhaus",
      "trainer Ottakring",
      "personal trainer Hernals",
      "trainer Währing",
      "personal trainer Döbling",
      "trainer Brigittenau",
      "personal trainer Floridsdorf",
      "trainer Donaustadt",
      "personal trainer Liesing",
      "Personal Trainer Wien",
      "Fitness Trainer Wien",
      "Personal Training Wien",
      "zertifizierter Trainer Wien",
    ].join(", "), // semantic keywords
    speakable: {
      // for AI voice/summarization models
      "@type": "SpeakableSpecification",
      xpath: ["/html/head/title", "/html/body/main/section/h1", "/html/body/main/section/p"],
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
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: "Personal Trainer Directory Vienna - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in Vienna",
      description: "Directory of certified personal trainers in Vienna",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <TrainerDirectoryLayout city="Vienna" districts={districts} trainers={trainers} />
        <Footer />
      </main>
    </>
  )
}

