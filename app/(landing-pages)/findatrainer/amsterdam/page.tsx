import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"
import { getArticlesByCategory } from "@/lib/blog"
import { RelatedArticles } from "@/components/related-articles"

export const dynamic = 'force-dynamic'

const ogImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/amsterdam-3902458_1280.jpg"

export const metadata: Metadata = {
  title: "Find a Personal Trainer in Amsterdam | Verified Fitness Coaches | Juice",
  description:
    "Discover certified personal trainers in Amsterdam. Connect with verified fitness professionals in Centrum, Noord, Oost, West, Zuid, Zuidoost, and Nieuw-West. Find your perfect trainer today.",
  keywords: [
    "personal trainer Amsterdam",
    "fitness trainer Amsterdam",
    "personal training Amsterdam",
    "certified trainer Amsterdam",
    "trainer directory Amsterdam",
    "personal trainer kosten",
    "personal trainer preise",
    "fitness coach Amsterdam",
    "personal trainer Centrum",
    "trainer Amsterdam-Noord",
    "personal trainer Oost",
    "trainer West",
    "personal trainer Zuid",
    "trainer Zuidoost",
    "personal trainer Nieuw-West",
    "Personal Trainer Amsterdam",
    "Fitness Trainer Amsterdam",
    "Personal Training Amsterdam",
    "zertifizierter Trainer Amsterdam",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/amsterdam",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/findatrainer/amsterdam",
    title: "Find a Personal Trainer in Amsterdam | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Amsterdam. Connect with verified fitness professionals in your neighborhood.",
    siteName: "Juice",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Amsterdam - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Personal Trainer in Amsterdam | Verified Fitness Coaches",
    description: "Discover certified personal trainers in Amsterdam. Find your perfect trainer today.",
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

export default async function AmsterdamTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("Amsterdam")
  const districts = getCityDistricts("Amsterdam")
  const relatedArticles = await getArticlesByCategory("Advice", 2)

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/amsterdam`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Find a Personal Trainer in Amsterdam | Verified Fitness Coaches",
    description:
      "Discover certified personal trainers in Amsterdam. Connect with verified fitness professionals in Centrum, Noord, Oost, West, Zuid, Zuidoost, and Nieuw-West. Find your perfect trainer today.",
    about: "Personal Training Directory, Fitness Coaches, Amsterdam", // helps topic classification for AI
    keywords: [
      "personal trainer Amsterdam",
      "fitness trainer Amsterdam",
      "personal training Amsterdam",
      "certified trainer Amsterdam",
      "trainer directory Amsterdam",
      "fitness coach Amsterdam",
      "personal trainer Centrum",
      "trainer Amsterdam-Noord",
      "personal trainer Oost",
      "trainer West",
      "personal trainer Zuid",
      "trainer Zuidoost",
      "personal trainer Nieuw-West",
      "Personal Trainer Amsterdam",
      "Fitness Trainer Amsterdam",
      "Personal Training Amsterdam",
      "zertifizierter Trainer Amsterdam",
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
      alt: "Personal Trainer Directory Amsterdam - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in Amsterdam",
      description: "Directory of certified personal trainers in Amsterdam",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <TrainerDirectoryLayout city="Amsterdam" districts={districts} trainers={trainers} />
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
          <RelatedArticles articles={relatedArticles} />
        </section>
        <Footer />
      </main>
    </>
  )
}

