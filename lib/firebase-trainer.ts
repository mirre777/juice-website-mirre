import { db } from "@/firebase"
import { collection, doc, getDoc, updateDoc, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
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
    profileImage: "/placeholder-user.jpg",
  },
  {
    id: "mock-trainer-2",
    fullName: "Mike Chen",
    email: "mike@example.com",
    location: "New York, NY",
    specialty: "Strength Training",
    experience: "3-5 years",
    bio: "Former athlete turned personal trainer. I focus on building strength and improving athletic performance for clients of all fitness levels.",
    services: ["Personal Training", "Group Classes"],
    status: "active",
    createdAt: new Date(),
    isActive: true,
    isPaid: true,
    profileImage: "/placeholder-user.jpg",
  },
]

export async function createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt">): Promise<string> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock trainer creation")
      const mockId = `mock-${Date.now()}`
      return mockId
    }

    const docRef = await addDoc(collection(db, "trainers"), {
      ...trainerData,
      createdAt: serverTimestamp(),
    })

    logger.info("Trainer created successfully", {
      trainerId: docRef.id,
      email: trainerData.email,
    })

    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer", {
      error: error instanceof Error ? error.message : String(error),
      email: trainerData.email,
    })
    throw error
  }
}

export async function getTrainer(trainerId: string): Promise<TrainerData | null> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock trainer data")
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
    logger.error("Error fetching trainer", {
      error: error instanceof Error ? error.message : String(error),
      trainerId,
    })
    return null
  }
}

export async function updateTrainer(trainerId: string, updates: Partial<TrainerData>): Promise<boolean> {
  try {
    if (!db) {
      logger.warn("Firebase not available, mock trainer update")
      return true
    }

    const docRef = doc(db, "trainers", trainerId)
    await updateDoc(docRef, updates)

    logger.info("Trainer updated successfully", {
      trainerId,
      updatedFields: Object.keys(updates),
    })

    return true
  } catch (error) {
    logger.error("Error updating trainer", {
      error: error instanceof Error ? error.message : String(error),
      trainerId,
    })
    return false
  }
}

export async function getActiveTrainers(): Promise<TrainerData[]> {
  try {
    if (!db) {
      logger.warn("Firebase not available, using mock trainer data")
      return mockTrainers.filter((trainer) => trainer.status === "active")
    }

    const q = query(collection(db, "trainers"), where("status", "==", "active"), where("isActive", "==", true))

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
    logger.error("Error fetching active trainers", {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function activateTrainer(trainerId: string): Promise<boolean> {
  try {
    if (!db) {
      logger.warn("Firebase not available, mock trainer activation")
      return true
    }

    const updates = {
      status: "active" as const,
      isActive: true,
      isPaid: true,
    }

    const docRef = doc(db, "trainers", trainerId)
    await updateDoc(docRef, updates)

    logger.info("Trainer activated successfully", {
      trainerId,
    })

    return true
  } catch (error) {
    logger.error("Error activating trainer", {
      error: error instanceof Error ? error.message : String(error),
      trainerId,
    })
    return false
  }
}
