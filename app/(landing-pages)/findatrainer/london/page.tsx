import type { Metadata } from "next"
import { TrainerDirectoryLayout } from "@/app/(landing-pages)/components/trainer-directory-layout"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getFirebaseWebappAdminDb, isBuildTime } from "@/lib/firebase-global-guard"

type Trainer = {
  id: string
  name: string
  imageUrl?: string
  isVerified: boolean
  certifications: string[]
  hasReviews: boolean
  specialties: string[]
  locations: string[]
  isOnline: boolean
}

async function fetchTrainersByCity(city: string): Promise<any[]> {
  if (isBuildTime()) return []
  
  try {
    const db = await getFirebaseWebappAdminDb()
    if (!db) return []
    
    const querySnapshot = await db.collection("trainer_profiles").where("city", "==", city).get()
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching trainers:", error)
    return []
  }
}

function parseCertifications(certifications: string | undefined | null): string[] {
  if (!certifications || typeof certifications !== "string") return []
  return certifications
    .split(/[,;]/)
    .map((cert) => cert.trim())
    .filter(Boolean)
}

function mapTrainerFromDb(doc: any): Trainer {
  const isVerified = doc.status === "claimed"
  
  const imageUrl = 
    doc.photos?.profileImageUrl || 
    doc.profileImageUrl || 
    doc.photo?.profileImageUrl ||
    doc.imageUrl ||
    undefined
  
  return {
    id: doc.id || "",
    name: doc.fullName || "",
    imageUrl,
    isVerified,
    certifications: parseCertifications(doc.certifications),
    hasReviews: false,
    specialties: Array.isArray(doc.services) ? doc.services : [],
    locations: doc.district ? [doc.district] : [],
    isOnline: false,
  }
}

function extractDistricts(trainers: Trainer[]): string[] {
  const districts = trainers
    .flatMap((trainer) => trainer.locations)
    .filter((district): district is string => Boolean(district))
  return [...new Set(districts)].sort()
}

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
  const dbTrainers = await fetchTrainersByCity("London")
  const trainers = dbTrainers.map(mapTrainerFromDb)
  const districts = extractDistricts(trainers)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="London" districts={districts} trainers={trainers} />
      <Footer />
    </main>
  )
}

