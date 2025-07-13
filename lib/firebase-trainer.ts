import { db } from "@/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { logger } from "@/lib/logger"

export interface TrainerData {
  id?: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  status: "temp" | "active" | "inactive"
  createdAt: any
  expiresAt?: Date
  sessionToken?: string
  isActive: boolean
  isPaid: boolean
  profileImage?: string
  website?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  pricing?: {
    sessionRate?: number
    packageDeals?: string
  }
  availability?: {
    schedule?: string
    timezone?: string
  }
}

// Mock data for when Firebase is not available
const mockTrainers: TrainerData[] = [
  {
    id: "mock-trainer-1",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    location: "Los Angeles, CA",
    specialty: "Weight Loss",
    experience: "5+ years",
    bio: "Certified personal trainer specializing in weight loss and strength training. I help clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
    services: ["Personal Training", "Nutrition Coaching"],
    status: "active",
    createdAt: new Date(),
    isActive: true,
    isPaid: true,
  },
  {
    id: "mock-trainer-2",
    fullName: "Mike Chen",
    email: "mike@example.com",
    location: "New York, NY",
    specialty: "Strength Training",
    experience: "3-5 years",
    bio: "Former competitive athlete turned personal trainer. I focus on building functional strength and helping clients develop proper form and technique.",
    services: ["Personal Training", "Group Classes"],
    status: "active",
    createdAt: new Date(),
    isActive: true,
    isPaid: true,
  },
]

export async function createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt">): Promise<string> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock mode for trainer creation")
      const mockId = `mock-${Date.now()}`
      return mockId
    }

    const docData = {
      ...trainerData,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "trainers"), docData)
    logger.info("Trainer created successfully", { trainerId: docRef.id, email: trainerData.email })
    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer", { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function getTrainer(trainerId: string): Promise<TrainerData | null> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock data")
      return mockTrainers.find((trainer) => trainer.id === trainerId) || null
    }

    const docRef = doc(db, "trainers", trainerId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
      } as TrainerData
    }

    return null
  } catch (error) {
    logger.error("Error fetching trainer", { trainerId, error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function getTrainerByEmail(email: string): Promise<TrainerData | null> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock data")
      return mockTrainers.find((trainer) => trainer.email === email) || null
    }

    const q = query(collection(db, "trainers"), where("email", "==", email), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as TrainerData
    }

    return null
  } catch (error) {
    logger.error("Error fetching trainer by email", {
      email,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export async function updateTrainer(trainerId: string, updates: Partial<TrainerData>): Promise<void> {
  try {
    if (!db) {
      logger.warn("Firebase not available, mock update")
      return
    }

    const docRef = doc(db, "trainers", trainerId)
    await updateDoc(docRef, updates)
    logger.info("Trainer updated successfully", { trainerId })
  } catch (error) {
    logger.error("Error updating trainer", { trainerId, error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function deleteTrainer(trainerId: string): Promise<void> {
  try {
    if (!db) {
      logger.warn("Firebase not available, mock delete")
      return
    }

    const docRef = doc(db, "trainers", trainerId)
    await deleteDoc(docRef)
    logger.info("Trainer deleted successfully", { trainerId })
  } catch (error) {
    logger.error("Error deleting trainer", { trainerId, error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function getActiveTrainers(limitCount = 10): Promise<TrainerData[]> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock data")
      return mockTrainers.filter((trainer) => trainer.status === "active").slice(0, limitCount)
    }

    const q = query(
      collection(db, "trainers"),
      where("status", "==", "active"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const querySnapshot = await getDocs(q)
    const trainers: TrainerData[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({
        id: doc.id,
        ...doc.data(),
      } as TrainerData)
    })

    return trainers
  } catch (error) {
    logger.error("Error fetching active trainers", { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function searchTrainers(searchParams: {
  location?: string
  specialty?: string
  experience?: string
}): Promise<TrainerData[]> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock data")
      let filtered = mockTrainers.filter((trainer) => trainer.status === "active")

      if (searchParams.location) {
        filtered = filtered.filter((trainer) =>
          trainer.location.toLowerCase().includes(searchParams.location!.toLowerCase()),
        )
      }
      if (searchParams.specialty) {
        filtered = filtered.filter((trainer) => trainer.specialty === searchParams.specialty)
      }
      if (searchParams.experience) {
        filtered = filtered.filter((trainer) => trainer.experience === searchParams.experience)
      }

      return filtered
    }

    let q = query(collection(db, "trainers"), where("status", "==", "active"), where("isActive", "==", true))

    if (searchParams.specialty) {
      q = query(q, where("specialty", "==", searchParams.specialty))
    }
    if (searchParams.experience) {
      q = query(q, where("experience", "==", searchParams.experience))
    }

    const querySnapshot = await getDocs(q)
    let trainers: TrainerData[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({
        id: doc.id,
        ...doc.data(),
      } as TrainerData)
    })

    // Filter by location on client side since Firestore doesn't support contains queries
    if (searchParams.location) {
      trainers = trainers.filter((trainer) =>
        trainer.location.toLowerCase().includes(searchParams.location!.toLowerCase()),
      )
    }

    return trainers
  } catch (error) {
    logger.error("Error searching trainers", {
      searchParams,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export async function activateTrainer(trainerId: string, sessionToken: string): Promise<boolean> {
  try {
    if (!db) {
      logger.warn("Firebase not available, mock activation")
      return true
    }

    const trainer = await getTrainer(trainerId)
    if (!trainer || trainer.sessionToken !== sessionToken) {
      return false
    }

    await updateTrainer(trainerId, {
      status: "active",
      isActive: true,
      isPaid: true,
    })

    logger.info("Trainer activated successfully", { trainerId })
    return true
  } catch (error) {
    logger.error("Error activating trainer", {
      trainerId,
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}
