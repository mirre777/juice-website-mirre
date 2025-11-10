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
  console.log("[DEBUG] fetchTrainersByCity called for city:", city)
  console.log("[DEBUG] isBuildTime():", isBuildTime())
  
  if (isBuildTime()) {
    console.log("[DEBUG] Build time detected, returning empty array")
    return []
  }
  
  console.log("[DEBUG] Environment variables check:")
  console.log("[DEBUG]   WEBAPP_FIREBASE_PROJECT_ID:", process.env.WEBAPP_FIREBASE_PROJECT_ID ? `SET (${process.env.WEBAPP_FIREBASE_PROJECT_ID})` : "MISSING")
  console.log("[DEBUG]   WEBAPP_FIREBASE_CLIENT_EMAIL:", process.env.WEBAPP_FIREBASE_CLIENT_EMAIL ? `SET (${process.env.WEBAPP_FIREBASE_CLIENT_EMAIL})` : "MISSING")
  console.log("[DEBUG]   WEBAPP_FIREBASE_PRIVATE_KEY:", process.env.WEBAPP_FIREBASE_PRIVATE_KEY ? `SET (length: ${process.env.WEBAPP_FIREBASE_PRIVATE_KEY.length})` : "MISSING")
  
  try {
    console.log("[DEBUG] Attempting to get Firebase webapp admin DB...")
    const db = await getFirebaseWebappAdminDb()
    
    if (!db) {
      console.log("[DEBUG] Database connection failed - db is null")
      return []
    }
    
    console.log("[DEBUG] Database connection successful, querying Firestore...")
    console.log("[DEBUG] Query: trainer_profiles where city == ", city)
    
    const querySnapshot = await db.collection("trainer_profiles").where("city", "==", city).get()
    
    console.log("[DEBUG] Query completed. Found", querySnapshot.docs.length, "trainers")
    
    if (querySnapshot.docs.length > 0) {
      console.log("[DEBUG] First trainer sample:", {
        id: querySnapshot.docs[0].id,
        city: querySnapshot.docs[0].data()?.city,
        fullName: querySnapshot.docs[0].data()?.fullName,
        status: querySnapshot.docs[0].data()?.status,
      })
    }
    
    return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("[DEBUG] Error fetching trainers:", error)
    console.error("[DEBUG] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
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
  const dbTrainers = await fetchTrainersByCity("Berlin")
  const trainers = dbTrainers.map(mapTrainerFromDb)
  const districts = extractDistricts(trainers)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city="Berlin" districts={districts} trainers={trainers} />
      <Footer />
    </main>
  )
}

