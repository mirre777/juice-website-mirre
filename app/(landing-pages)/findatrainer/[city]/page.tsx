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

type TrainerDirectoryPageProps = {
  params: Promise<{
    city: string
  }>
}

// Sample data for Berlin
const berlinDistricts = [
  "Friedrichshain",
  "Mitte",
  "Kreuzberg",
  "Prenzlauer Berg",
  "Neukölln",
  "Charlottenburg",
  "Tempelhof",
  "Tiergarten",
]

const berlinTrainers = [
  {
    id: "1",
    name: "Sarah Mueller",
    isVerified: true,
    certifications: ["NASM CPT", "Certified Nutrition Coach"],
    hasReviews: true,
    specialties: ["Strength Training", "Weight Loss", "Nutrition"],
    locations: ["Friedrichshain", "Kreuzberg"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Marcus Weber",
    isVerified: true,
    certifications: ["Personal Trainer Certification"],
    hasReviews: false,
    specialties: ["Nutrition Coaching", "Powerlifting"],
    locations: ["Friedrichshain"],
    isOnline: false,
  },
  {
    id: "3",
    name: "Lisa Hoffmann",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Yoga / Pilates", "Strength Training"],
    locations: ["Friedrichshain", "Mitte", "Prenzlauer Berg"],
    isOnline: true,
  },
  {
    id: "4",
    name: "Thomas Richter",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Boxing", "Bodybuilding", "Cardio"],
    locations: ["Friedrichshain", "Kreuzberg"],
    isOnline: true,
  },
  {
    id: "5",
    name: "Anna Schneider",
    isVerified: true,
    certifications: ["ACSM CPT"],
    hasReviews: false,
    specialties: ["Functional Training", "Rehabilitation"],
    locations: ["Friedrichshain"],
    isOnline: false,
  },
  {
    id: "6",
    name: "Kevin Martinez",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Calisthenics", "Bodyweight"],
    locations: ["Friedrichshain", "Neukölln"],
    isOnline: false,
  },
  {
    id: "7",
    name: "David Kim",
    isVerified: true,
    certifications: ["NSCA CSCS"],
    hasReviews: false,
    specialties: ["Strength & Conditioning", "Sports Performance"],
    locations: ["Mitte"],
    isOnline: true,
  },
  {
    id: "8",
    name: "Maria Schmidt",
    isVerified: true,
    certifications: ["NASM CPT", "ACSM CPT", "NSCA CSCS", "Certified Nutrition Coach", "Yoga Instructor", "Pilates Certification"],
    hasReviews: true,
    specialties: ["Yoga", "Pilates", "Strength Training", "Flexibility", "Rehabilitation"],
    locations: ["Charlottenburg", "Mitte", "Prenzlauer Berg"],
    isOnline: true,
  },
]

// Sample data for London
const londonDistricts = [
  "Westminster",
  "Camden",
  "Islington",
  "Hackney",
  "Tower Hamlets",
  "Southwark",
  "Lambeth",
  "Kensington and Chelsea",
  "Hammersmith and Fulham",
]

const londonTrainers = [
  {
    id: "1",
    name: "James Wilson",
    isVerified: true,
    certifications: ["NASM CPT", "Certified Nutrition Coach"],
    hasReviews: true,
    specialties: ["Strength Training", "Weight Loss", "Nutrition"],
    locations: ["Westminster", "Camden"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Emma Thompson",
    isVerified: true,
    certifications: ["ACSM CPT"],
    hasReviews: true,
    specialties: ["Yoga", "Pilates", "Flexibility"],
    locations: ["Islington", "Hackney"],
    isOnline: true,
  },
  {
    id: "3",
    name: "Michael Brown",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Boxing", "Cardio", "HIIT"],
    locations: ["Tower Hamlets", "Southwark"],
    isOnline: false,
  },
  {
    id: "4",
    name: "Sophie Davis",
    isVerified: true,
    certifications: ["NSCA CSCS"],
    hasReviews: false,
    specialties: ["Strength & Conditioning", "Athletic Performance"],
    locations: ["Kensington and Chelsea"],
    isOnline: true,
  },
  {
    id: "5",
    name: "Oliver Taylor",
    isVerified: false,
    certifications: [],
    hasReviews: false,
    specialties: ["Calisthenics", "Bodyweight Training"],
    locations: ["Lambeth", "Southwark"],
    isOnline: false,
  },
]

const cityData = {
  berlin: { cityName: "Berlin", districts: berlinDistricts, trainers: berlinTrainers },
  london: { cityName: "London", districts: londonDistricts, trainers: londonTrainers },
}

const defaultCityData = { cityName: "Berlin", districts: berlinDistricts, trainers: berlinTrainers }

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
  
  // Try multiple possible field paths for profile image
  const imageUrl = 
    doc.photos?.profileImageUrl || 
    doc.profileImageUrl || 
    doc.photo?.profileImageUrl ||
    doc.imageUrl ||
    undefined
  
  // Debug logging for image URLs
  if (isVerified && doc.fullName) {
    console.log(`[SERVER] Trainer ${doc.fullName}:`, {
      status: doc.status,
      isVerified,
      hasPhotos: !!doc.photos,
      photosKeys: doc.photos ? Object.keys(doc.photos) : [],
      imageUrl,
      photosObject: doc.photos,
      allDocKeys: Object.keys(doc).filter(k => k.toLowerCase().includes('photo') || k.toLowerCase().includes('image')),
    })
  }
  
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

function getCityData(city: string) {
  const normalizedCity = city.toLowerCase()
  return cityData[normalizedCity as keyof typeof cityData] || {
    ...defaultCityData,
    cityName: city.charAt(0).toUpperCase() + city.slice(1),
  }
}

export default async function TrainerDirectoryPage({ params }: TrainerDirectoryPageProps) {
  const { city } = await params
  const { cityName } = getCityData(city)
  const dbTrainers = await fetchTrainersByCity(cityName)
  const trainers = dbTrainers.map(mapTrainerFromDb)
  const districts = extractDistricts(trainers)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <TrainerDirectoryLayout city={cityName} districts={districts} trainers={trainers} />
      <Footer />
    </main>
  )
}

