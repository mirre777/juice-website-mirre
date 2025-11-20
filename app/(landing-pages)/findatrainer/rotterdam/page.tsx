import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchTrainersForCity, getCityDistricts } from "@/app/(landing-pages)/utils/trainer-directory-utils"
import { getRandomArticles } from "@/lib/blog"
import { RelatedArticles } from "@/components/related-articles"

export const dynamic = 'force-dynamic'

const ogImageUrl = "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/rotterdam-7095262_1280.jpg"

export const metadata: Metadata = {
  title: "Personal Training Rotterdam - Vind jouw trainer | Juice",
  description:
    "Vind gecertificeerde personal trainers in Rotterdam. Kies verified coaches in Stadscentrum, Delfshaven, Kralingen-Crooswijk, Hoek van Holland, Rozenburg en meer.",
  keywords: [
    "personal trainer Rotterdam",
    "fitness coach Rotterdam",
    "personal training Rotterdam",
    "proefles Rotterdam",
    "spieropbouw Rotterdam",
    "personal trainer Stadscentrum",
    "personal trainer Delfshaven",
    "personal trainer Overschie",
    "personal trainer Noord",
    "personal trainer Hillegersberg-Schiebroek",
    "personal trainer Kralingen-Crooswijk",
    "personal trainer Feijenoord",
    "personal trainer IJsselmonde",
    "personal trainer Pernis",
    "personal trainer Prins Alexander",
    "personal trainer Charlois",
    "personal trainer Hoogvliet",
    "personal trainer Hoek van Holland",
    "personal trainer Spaanse Polder",
    "personal trainer Nieuw-Mathenesse",
    "personal trainer Waalhaven-Eemhaven",
    "personal trainer Vondelingenplaat",
    "personal trainer Botlek-Europoort-Maasvlakte",
    "personal trainer Rotterdam-Noord-West",
    "personal trainer Rivium",
    "personal trainer Bedrijventerrein Schieveen",
    "personal trainer Rozenburg",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  metadataBase: new URL("https://juice.fitness"),
  alternates: {
    canonical: "/findatrainer/rotterdam",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/findatrainer/rotterdam",
    title: "Personal Training Rotterdam - Vind jouw trainer | Juice",
    description:
      "Vind gecertificeerde personal trainers in Rotterdam. Kies verified coaches in Stadscentrum, Delfshaven, Kralingen-Crooswijk, Hoek van Holland, Rozenburg en meer.",
    siteName: "Juice",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Personal Trainer Directory Rotterdam - Juice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Training Rotterdam - Vind jouw trainer | Juice",
    description:
      "Vind gecertificeerde personal trainers in Rotterdam. Kies verified coaches in Stadscentrum, Delfshaven, Kralingen-Crooswijk, Hoek van Holland, Rozenburg en meer.",
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

export default async function RotterdamTrainerDirectoryPage() {
  const trainers = await fetchTrainersForCity("Rotterdam")
  const districts = getCityDistricts("Rotterdam")
  const relatedArticles = await getRandomArticles(2)

  const baseUrl = "https://juice.fitness"
  const fullUrl = `${baseUrl}/findatrainer/rotterdam`

  // JSON-LD structured data for LLM optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": fullUrl, // unique page reference for LLMs
    url: fullUrl, // explicit canonical link
    name: "Personal Training Rotterdam - Vind jouw trainer | Juice",
    description:
      "Vind gecertificeerde personal trainers in Rotterdam. Kies verified coaches in Stadscentrum, Delfshaven, Kralingen-Crooswijk, Hoek van Holland, Rozenburg en meer.",
    about: "Personal Training Directory, Fitness Coaches, Rotterdam", // helps topic classification for AI
    keywords: [
      "personal trainer Rotterdam",
      "fitness coach Rotterdam",
      "personal training Rotterdam",
      "proefles Rotterdam",
      "spieropbouw Rotterdam",
      "personal trainer Stadscentrum",
      "personal trainer Delfshaven",
      "personal trainer Overschie",
      "personal trainer Noord",
      "personal trainer Hillegersberg-Schiebroek",
      "personal trainer Kralingen-Crooswijk",
      "personal trainer Feijenoord",
      "personal trainer IJsselmonde",
      "personal trainer Pernis",
      "personal trainer Prins Alexander",
      "personal trainer Charlois",
      "personal trainer Hoogvliet",
      "personal trainer Hoek van Holland",
      "personal trainer Spaanse Polder",
      "personal trainer Nieuw-Mathenesse",
      "personal trainer Waalhaven-Eemhaven",
      "personal trainer Vondelingenplaat",
      "personal trainer Botlek-Europoort-Maasvlakte",
      "personal trainer Rotterdam-Noord-West",
      "personal trainer Rivium",
      "personal trainer Bedrijventerrein Schieveen",
      "personal trainer Rozenburg",
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
      alt: "Personal Trainer Directory Rotterdam - Juice",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Personal Trainers in Rotterdam",
      description: "Directory of certified personal trainers in Rotterdam",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <TrainerDirectoryLayout city="Rotterdam" districts={districts} trainers={trainers} />
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
          <RelatedArticles articles={relatedArticles} />
        </section>
        <Footer />
      </main>
    </>
  )
}

