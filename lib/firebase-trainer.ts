import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "@/app/api/firebase-config"
import { logger } from "./logger"

export interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
}

export interface TrainerContent {
  heroTitle?: string
  heroSubtitle?: string
  aboutTitle?: string
  aboutContent?: string
  services?: Service[]
  contactEmail?: string
  contactPhone?: string
  contactLocation?: string
  seoTitle?: string
  seoDescription?: string
  version?: number
  lastModified?: Timestamp
}

export interface Trainer {
  id: string
  name: string
  email: string
  specialization: string
  experience: string
  location: string
  bio: string
  status: "active" | "pending" | "inactive"
  tempId?: string
  paymentIntentId?: string
  content?: TrainerContent
  createdAt: Timestamp
  updatedAt: Timestamp
}

const TRAINERS_COLLECTION = "trainers"

export async function createTrainer(trainerData: Omit<Trainer, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const trainersRef = collection(db, TRAINERS_COLLECTION)
    const docRef = doc(trainersRef)

    const trainer: Trainer = {
      ...trainerData,
      id: docRef.id,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    }

    await setDoc(docRef, trainer)
    logger.info(`Trainer created: ${docRef.id}`)

    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer:", error)
    throw error
  }
}

export async function getTrainer(id: string): Promise<Trainer | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const docRef = doc(db, TRAINERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Trainer
    }

    return null
  } catch (error) {
    logger.error(`Error getting trainer ${id}:`, error)
    throw error
  }
}

export async function getTrainerByTempId(tempId: string): Promise<Trainer | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const q = query(collection(db, TRAINERS_COLLECTION), where("tempId", "==", tempId))

    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Trainer
    }

    return null
  } catch (error) {
    logger.error(`Error getting trainer by tempId ${tempId}:`, error)
    throw error
  }
}

export async function updateTrainer(id: string, updates: Partial<Trainer>): Promise<Trainer | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const docRef = doc(db, TRAINERS_COLLECTION, id)

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
    logger.info(`Trainer updated: ${id}`)

    return await getTrainer(id)
  } catch (error) {
    logger.error(`Error updating trainer ${id}:`, error)
    throw error
  }
}

export async function updateTrainerContent(id: string, content: TrainerContent): Promise<Trainer | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const docRef = doc(db, TRAINERS_COLLECTION, id)

    // Get current trainer to check existing content version
    const currentTrainer = await getTrainer(id)
    if (!currentTrainer) {
      throw new Error("Trainer not found")
    }

    // Generate default content if this is the first time
    const enhancedContent = await generateDefaultContent(currentTrainer, content)

    const updateData = {
      content: {
        ...enhancedContent,
        version: (currentTrainer.content?.version || 0) + 1,
        lastModified: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
    logger.info(`Trainer content updated: ${id}`)

    return await getTrainer(id)
  } catch (error) {
    logger.error(`Error updating trainer content ${id}:`, error)
    throw error
  }
}

export async function activateTrainer(id: string): Promise<Trainer | null> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const trainer = await getTrainer(id)
    if (!trainer) {
      throw new Error("Trainer not found")
    }

    // Generate default content when activating
    const defaultContent = await generateDefaultContent(trainer)

    const updates = {
      status: "active" as const,
      content: {
        ...defaultContent,
        version: 1,
        lastModified: serverTimestamp(),
      },
    }

    return await updateTrainer(id, updates)
  } catch (error) {
    logger.error(`Error activating trainer ${id}:`, error)
    throw error
  }
}

async function generateDefaultContent(trainer: Trainer, existingContent?: TrainerContent): Promise<TrainerContent> {
  // Merge existing content with generated defaults
  return {
    heroTitle: existingContent?.heroTitle || `${trainer.name} - Professional ${trainer.specialization}`,
    heroSubtitle:
      existingContent?.heroSubtitle ||
      `${trainer.experience} of experience helping clients achieve their fitness goals in ${trainer.location}`,
    aboutTitle: existingContent?.aboutTitle || "About Me",
    aboutContent:
      existingContent?.aboutContent ||
      trainer.bio ||
      `Hi, I'm ${trainer.name}, a dedicated ${trainer.specialization} with ${trainer.experience} of experience. I'm passionate about helping people transform their lives through fitness and wellness.`,
    services: existingContent?.services || [
      {
        id: "1",
        title: "Personal Training",
        description: "One-on-one personalized training sessions tailored to your goals",
        price: "€60",
        duration: "60 minutes",
      },
      {
        id: "2",
        title: "Nutrition Coaching",
        description: "Comprehensive nutrition guidance and meal planning",
        price: "€40",
        duration: "45 minutes",
      },
    ],
    contactEmail: existingContent?.contactEmail || trainer.email,
    contactPhone: existingContent?.contactPhone || "",
    contactLocation: existingContent?.contactLocation || trainer.location,
    seoTitle: existingContent?.seoTitle || `${trainer.name} - ${trainer.specialization} in ${trainer.location}`,
    seoDescription:
      existingContent?.seoDescription ||
      `Professional ${trainer.specialization} with ${trainer.experience} of experience. Book your session today!`,
    ...existingContent,
  }
}

export async function getAllTrainers(): Promise<Trainer[]> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const querySnapshot = await getDocs(collection(db, TRAINERS_COLLECTION))
    const trainers: Trainer[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({ id: doc.id, ...doc.data() } as Trainer)
    })

    return trainers
  } catch (error) {
    logger.error("Error getting all trainers:", error)
    throw error
  }
}

export async function getActiveTrainers(): Promise<Trainer[]> {
  try {
    if (!db) {
      throw new Error("Firebase database not initialized")
    }

    const q = query(collection(db, TRAINERS_COLLECTION), where("status", "==", "active"))

    const querySnapshot = await getDocs(q)
    const trainers: Trainer[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({ id: doc.id, ...doc.data() } as Trainer)
    })

    return trainers
  } catch (error) {
    logger.error("Error getting active trainers:", error)
    throw error
  }
}
