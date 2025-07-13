import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "../app/api/firebase-config"
import { logger } from "./logger"

// Trainer interface
export interface Trainer {
  id?: string
  name: string
  email: string
  specialization: string
  bio?: string
  experience?: string
  certifications?: string[]
  services?: Service[]
  contactInfo?: ContactInfo
  socialMedia?: SocialMedia
  availability?: Availability
  pricing?: Pricing
  location?: string
  profileImage?: string
  status: "pending" | "active" | "inactive"
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Service {
  id?: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  category: string
}

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
  address?: string
}

export interface SocialMedia {
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  youtube?: string
}

export interface Availability {
  monday?: TimeSlot[]
  tuesday?: TimeSlot[]
  wednesday?: TimeSlot[]
  thursday?: TimeSlot[]
  friday?: TimeSlot[]
  saturday?: TimeSlot[]
  sunday?: TimeSlot[]
}

export interface TimeSlot {
  start: string // HH:MM format
  end: string // HH:MM format
}

export interface Pricing {
  hourlyRate?: number
  packageDeals?: PackageDeal[]
  consultationFee?: number
}

export interface PackageDeal {
  name: string
  sessions: number
  price: number
  description?: string
}

// Temporary trainer interface
export interface TempTrainer {
  id?: string
  trainerId: string
  name: string
  specialization: string
  bio?: string
  status: "active" | "expired"
  createdAt?: Timestamp
  expiresAt?: Date
}

// Create a new trainer
export async function createTrainer(trainerData: Omit<Trainer, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    logger.info("Creating new trainer", { name: trainerData.name })

    const docData = {
      ...trainerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "trainers"), docData)

    logger.info("Trainer created successfully", { id: docRef.id, name: trainerData.name })
    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer", { error, trainerData })
    throw error
  }
}

// Get trainer by ID
export async function getTrainer(id: string): Promise<Trainer | null> {
  try {
    const docRef = doc(db, "trainers", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Trainer
    } else {
      logger.warn("Trainer not found", { id })
      return null
    }
  } catch (error) {
    logger.error("Error getting trainer", { error, id })
    throw error
  }
}

// Update trainer
export async function updateTrainer(id: string, updates: Partial<Trainer>): Promise<void> {
  try {
    const docRef = doc(db, "trainers", id)
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
    logger.info("Trainer updated successfully", { id })
  } catch (error) {
    logger.error("Error updating trainer", { error, id, updates })
    throw error
  }
}

// Delete trainer
export async function deleteTrainer(id: string): Promise<void> {
  try {
    const docRef = doc(db, "trainers", id)
    await deleteDoc(docRef)
    logger.info("Trainer deleted successfully", { id })
  } catch (error) {
    logger.error("Error deleting trainer", { error, id })
    throw error
  }
}

// Get all trainers with optional filters
export async function getTrainers(filters?: {
  specialization?: string
  status?: string
  limit?: number
}): Promise<Trainer[]> {
  try {
    let q = query(collection(db, "trainers"))

    if (filters?.specialization) {
      q = query(q, where("specialization", "==", filters.specialization))
    }

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status))
    }

    q = query(q, orderBy("createdAt", "desc"))

    if (filters?.limit) {
      q = query(q, limit(filters.limit))
    }

    const querySnapshot = await getDocs(q)
    const trainers: Trainer[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({ id: doc.id, ...doc.data() } as Trainer)
    })

    logger.info("Retrieved trainers", { count: trainers.length, filters })
    return trainers
  } catch (error) {
    logger.error("Error getting trainers", { error, filters })
    throw error
  }
}

// Create temporary trainer profile
export async function createTempTrainer(tempData: Omit<TempTrainer, "id" | "createdAt">): Promise<string> {
  try {
    logger.info("Creating temporary trainer profile", { trainerId: tempData.trainerId })

    const docData = {
      ...tempData,
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "temp-trainers"), docData)

    logger.info("Temporary trainer profile created", { id: docRef.id, trainerId: tempData.trainerId })
    return docRef.id
  } catch (error) {
    logger.error("Error creating temporary trainer profile", { error, tempData })
    throw error
  }
}

// Get temporary trainer by ID
export async function getTempTrainer(id: string): Promise<TempTrainer | null> {
  try {
    const docRef = doc(db, "temp-trainers", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      // Check if expired
      if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
        logger.warn("Temporary trainer profile expired", { id })
        return { ...data, id: docSnap.id, status: "expired" } as TempTrainer
      }

      return { id: docSnap.id, ...data } as TempTrainer
    } else {
      logger.warn("Temporary trainer not found", { id })
      return null
    }
  } catch (error) {
    logger.error("Error getting temporary trainer", { error, id })
    throw error
  }
}

// Activate trainer (move from pending to active)
export async function activateTrainer(id: string): Promise<void> {
  try {
    await updateTrainer(id, { status: "active" })
    logger.info("Trainer activated", { id })
  } catch (error) {
    logger.error("Error activating trainer", { error, id })
    throw error
  }
}

// Deactivate trainer
export async function deactivateTrainer(id: string): Promise<void> {
  try {
    await updateTrainer(id, { status: "inactive" })
    logger.info("Trainer deactivated", { id })
  } catch (error) {
    logger.error("Error deactivating trainer", { error, id })
    throw error
  }
}

// Search trainers by name or specialization
export async function searchTrainers(searchTerm: string): Promise<Trainer[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches by specialization
    // For production, consider using Algolia or similar service

    const q = query(
      collection(db, "trainers"),
      where("specialization", ">=", searchTerm),
      where("specialization", "<=", searchTerm + "\uf8ff"),
      where("status", "==", "active"),
      orderBy("specialization"),
      limit(20),
    )

    const querySnapshot = await getDocs(q)
    const trainers: Trainer[] = []

    querySnapshot.forEach((doc) => {
      trainers.push({ id: doc.id, ...doc.data() } as Trainer)
    })

    logger.info("Search completed", { searchTerm, count: trainers.length })
    return trainers
  } catch (error) {
    logger.error("Error searching trainers", { error, searchTerm })
    throw error
  }
}
