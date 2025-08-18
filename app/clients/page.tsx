import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClientHeroSection } from "@/components/client-hero-section"
import { ClientFeaturesSection } from "@/components/client-features-section"
import { ClientFAQSection } from "@/components/client-faq-section"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"

export const metadata: Metadata = {
  title: "Persoonlijke Fitness App | Train met Personal Trainer of Zelfstandig | Juice",
  description:
    "Train met een personal trainer aan huis of online via onze gratis fitness app. Geen sportschool nodig. Betaal per sessie, geen abonnement. Download nu voor iOS en Android.",
  keywords: [
    "personal trainer app",
    "fitness app Nederland",
    "personal trainer aan huis",
    "gratis workout app",
    "fitness trainer online",
    "thuis trainen app",
    "personal training zonder sportschool",
    "fitness app gratis",
    "workout app Nederlands",
    "personal trainer kosten",
  ],
  authors: [{ name: "Juice" }],
  creator: "Juice",
  publisher: "Juice",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://juice-website-mirre.vercel.app"),
  alternates: {
    canonical: "/clients",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/clients",
    title: "Persoonlijke Fitness App | Train met Personal Trainer of Zelfstandig",
    description:
      "Train met een personal trainer aan huis of online via onze gratis fitness app. Geen sportschool nodig. Betaal per sessie, geen abonnement.",
    siteName: "Juice",
    images: [
      {
        url: "/images/og-feature-graphic.png",
        width: 1200,
        height: 630,
        alt: "Juice Fitness App - Personal Training Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Persoonlijke Fitness App | Train met Personal Trainer of Zelfstandig",
    description:
      "Train met een personal trainer aan huis of online. Gratis app, betaal alleen voor begeleiding. Download nu!",
    images: ["/images/og-feature-graphic.png"],
    creator: "@juice_app",
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

// Structured Data for the page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Juice Fitness App",
  description:
    "Persoonlijke fitness app voor training met personal trainer aan huis of zelfstandig trainen. Gratis te gebruiken.",
  url: "https://juice-website-mirre.vercel.app/clients",
  applicationCategory: "HealthApplication",
  operatingSystem: ["iOS", "Android"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Gratis app, betaal alleen voor personal trainer sessies",
  },
  publisher: {
    "@type": "Organization",
    name: "Juice",
    logo: {
      "@type": "ImageObject",
      url: "https://juice-website-mirre.vercel.app/images/juiceNewLogoPrime.png",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "100",
  },
}

export default function ClientsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <ClientHeroSection />
        <ClientFeaturesSection />
        <ClientFAQSection />
        <Footer />
        <FloatingDownloadCTA />
      </main>
    </>
  )
}
