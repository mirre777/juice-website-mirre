import { getFirebaseWebappAdminDb, isBuildTime } from "@/lib/firebase-global-guard"

export type Trainer = {
  id: string
  name: string
  imageUrl?: string
  isVerified: boolean
  certifications: string[]
  hasReviews: boolean
  specialties: string[]
  locations: string[]
  isOnline: boolean
  publicPath?: string
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

function mapTrainerFromDb(doc: any, hasReviews: boolean = false): Trainer {
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
    hasReviews,
    specialties: Array.isArray(doc.services) ? doc.services : [],
    locations: doc.district ? [doc.district] : [],
    isOnline: false,
    publicPath: doc.publicPath || undefined,
  }
}

export function extractDistricts(trainers: Trainer[]): string[] {
  const districts = trainers
    .flatMap((trainer) => trainer.locations)
    .filter((district): district is string => Boolean(district))
  return [...new Set(districts)].sort()
}

export async function fetchTrainersForCity(city: string): Promise<Trainer[]> {
  const dbTrainers = await fetchTrainersByCity(city)
  if (!dbTrainers.length) return []
  
  const db = await getFirebaseWebappAdminDb()
  if (!db) return dbTrainers.map((doc) => mapTrainerFromDb(doc))
  
  const reviewsMap = new Map(
    await Promise.all(
      dbTrainers.map(async (trainer) => {
        try {
          const reviewSnapshot = await db
            .collection("trainer_profiles")
            .doc(trainer.id)
            .collection("client-reviews")
            .limit(1)
            .get()
          return [trainer.id, !reviewSnapshot.empty] as [string, boolean]
        } catch {
          return [trainer.id, false] as [string, boolean]
        }
      })
    )
  )
  
  return dbTrainers.map((trainer) => mapTrainerFromDb(trainer, reviewsMap.get(trainer.id) || false))
}

