import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"
import { getArticlesByCategory } from "@/lib/blog"
import { RelatedArticles } from "@/components/related-articles"

export const dynamic = 'force-dynamic'

const ogImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/the%20hague%20pier.jpg"

export const metadata: Metadata = {
  title: "Personal Training Den Haag - Vind jouw trainer | Juice",
  description:
    "Vind gecertificeerde personal trainers in Den Haag. Kies verified coaches in Centrum, Scheveningen, Segbroek, Haagse Hout, Loosduinen en meer. Start vandaag nog met je training.",
  keywords: [
    "personal trainer Den Haag",
    "personal trainer The Hague",
    "fitness coach Den Haag",
    "proefles Den Haag",
    "spieropbouw Den Haag",
    "personal training",
    "personal trainer Centrum",
    "trainer Scheveningen",
    "personal trainer Segbroek",
    "trainer Haagse Hout",
    "personal trainer Loosduinen",
    "trainer Laak",
    "personal trainer Leidschenveen-Ypenburg",
    "trainer Escamp",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/the-hague",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/findatrainer/the-hague",
    title: "Personal Training Den Haag - Vind jouw trainer | Juice",
    description:
      "Vind gecertificeerde personal trainers in Den Haag. Kies verified coaches in Centrum, Scheveningen, Segbroek, Haagse Hout, Loosduinen en meer. Start vandaag nog met je training.",
    siteName: "Juice",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Den Haag - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training Den Haag - Vind jouw trainer | Juice",
    description: "Vind gecertificeerde personal trainers in Den Haag. Kies verified coaches in Centrum, Scheveningen, Segbroek, Haagse Hout, Loosduinen en meer. Start vandaag nog met je training.",
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

export default async function TheHagueTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("The Hague")
  const districts = getCityDistricts("The Hague")
  const relatedArticles = await getArticlesByCategory("Advice", 2)

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/the-hague`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Personal Training Den Haag - Vind jouw trainer | Juice",
    description:
      "Vind gecertificeerde personal trainers in Den Haag. Kies verified coaches in Centrum, Scheveningen, Segbroek, Haagse Hout, Loosduinen en meer. Start vandaag nog met je training.",
    about: "Personal Training Directory, Fitness Coaches, Den Haag", // helps topic classification for AI
    keywords: [
      "personal trainer Den Haag",
      "personal trainer The Hague",
      "fitness coach Den Haag",
      "proefles Den Haag",
      "spieropbouw Den Haag",
      "personal training",
      "personal trainer Centrum",
      "trainer Scheveningen",
      "personal trainer Segbroek",
      "trainer Haagse Hout",
      "personal trainer Loosduinen",
      "trainer Laak",
      "personal trainer Leidschenveen-Ypenburg",
      "trainer Escamp",
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
      alt: "Personal Trainer Directory Den Haag - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in Den Haag",
      description: "Directory of certified personal trainers in Den Haag",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <TrainerDirectoryLayout city="The Hague" districts={districts} trainers={trainers} />
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
          <RelatedArticles articles={relatedArticles} />
        </section>
        <Footer />
      </main>
    </>
  )
}

