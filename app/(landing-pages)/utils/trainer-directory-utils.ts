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
  districtDisplay?: string
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

function parseDistricts(district: string | undefined | null): string[] {
  if (!district || typeof district !== "string") return []
  return district
    .split(/[,;]/)
    .map((d) => d.trim())
    .filter(Boolean)
}

function mapTrainerFromDb(doc: any, hasReviews: boolean = false): Trainer {
  const imageUrl = 
    doc.photos?.profileImageUrl || 
    doc.profileImageUrl || 
    doc.photo?.profileImageUrl ||
    doc.imageUrl ||
    undefined
  const isVerified = doc.status === "claimed" || imageUrl !== undefined
  
  return {
    id: doc.id || "",
    name: doc.fullName || "",
    imageUrl,
    isVerified,
    certifications: parseCertifications(doc.certifications),
    hasReviews,
    specialties: Array.isArray(doc.services) ? doc.services : [],
    locations: doc.district ? parseDistricts(doc.district) : [],
    isOnline: false,
    publicPath: doc.publicPath || undefined,
    districtDisplay: doc.district || undefined,
  }
}

export function extractDistricts(trainers: Trainer[]): string[] {
  const districts = trainers
    .flatMap((trainer) => trainer.locations)
    .filter((district): district is string => Boolean(district))
  return [...new Set(districts)].sort()
}

const preserveCompoundDistricts = new Set([
  "City of London",
  "City of Westminster",
  "Richmond upon Thames",
  "Kingston upon Thames",
  "Hillegersberg-Schiebroek",
  "Kralingen-Crooswijk",
  "Nieuw-Mathenesse",
  "Waalhaven-Eemhaven",
  "Botlek-Europoort-Maasvlakte",
  "Rotterdam-Noord-West",
])

function splitCompoundDistrict(district: string): string[] {
  if (preserveCompoundDistricts.has(district)) {
    return [district]
  }
  const parts = district.split(/[-]| and /).map((d) => d.trim()).filter(Boolean)
  return parts.length > 1 ? parts : [district]
}

export function getCityDistricts(city: string): string[] {
  const cityDistricts: Record<string, string[]> = {
    Vienna: [
      "Innere Stadt",
      "Leopoldstadt",
      "Landstraße",
      "Wieden",
      "Margareten",
      "Mariahilf",
      "Neubau",
      "Josefstadt",
      "Alsergrund",
      "Favoriten",
      "Simmering",
      "Meidling",
      "Hietzing",
      "Penzing",
      "Rudolfsheim-Fünfhaus",
      "Ottakring",
      "Hernals",
      "Währing",
      "Döbling",
      "Brigittenau",
      "Floridsdorf",
      "Donaustadt",
      "Liesing",
    ],
    Berlin: [
      "Mitte",
      "Friedrichshain-Kreuzberg",
      "Pankow",
      "Charlottenburg-Wilmersdorf",
      "Spandau",
      "Steglitz-Zehlendorf",
      "Tempelhof-Schöneberg",
      "Neukölln",
      "Treptow-Köpenick",
      "Marzahn-Hellersdorf",
      "Lichtenberg",
      "Reinickendorf",
    ],
    London: [
      "City of London",
      "City of Westminster",
      "Kensington and Chelsea",
      "Hammersmith and Fulham",
      "Wandsworth",
      "Lambeth",
      "Southwark",
      "Tower Hamlets",
      "Hackney",
      "Islington",
      "Camden",
      "Brent",
      "Ealing",
      "Hounslow",
      "Richmond upon Thames",
      "Kingston upon Thames",
      "Merton",
      "Sutton",
      "Croydon",
      "Bromley",
      "Lewisham",
      "Greenwich",
      "Bexley",
      "Havering",
      "Barking and Dagenham",
      "Redbridge",
      "Newham",
      "Waltham Forest",
      "Haringey",
      "Enfield",
      "Barnet",
      "Harrow",
      "Hillingdon",
    ],
    Amsterdam: [
      "Centrum",
      "Noord",
      "Oost",
      "West",
      "Zuid",
      "Zuidoost",
      "Nieuw-West",
    ],
    Rotterdam: [
      "Stadscentrum",
      "Delfshaven",
      "Overschie",
      "Noord",
      "Hillegersberg-Schiebroek",
      "Kralingen-Crooswijk",
      "Feijenoord",
      "IJsselmonde",
      "Pernis",
      "Prins Alexander",
      "Charlois",
      "Hoogvliet",
      "Hoek van Holland",
      "Spaanse Polder",
      "Nieuw-Mathenesse",
      "Waalhaven-Eemhaven",
      "Vondelingenplaat",
      "Botlek-Europoort-Maasvlakte",
      "Rotterdam-Noord-West",
      "Rivium",
      "Bedrijventerrein Schieveen",
      "Rozenburg",
    ],
  }
  
  const districts = cityDistricts[city] || []
  
  // Split compound districts and flatten the result
  const splitDistricts = districts.flatMap((district) => splitCompoundDistrict(district))
  
  // Remove duplicates and sort
  return [...new Set(splitDistricts)].sort()
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

