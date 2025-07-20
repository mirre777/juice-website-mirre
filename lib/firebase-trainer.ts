import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { initializeApp, getApps } from "firebase/app"
import { nanoid } from "nanoid"

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export interface TrainerData {
  id?: string
  fullName: string
  email: string
  phone: string
  location: string
  experience: string
  certifications: string
  specialty: string
  bio: string
  services: string[]
  status: "pending" | "active" | "inactive"
  createdAt: string
  updatedAt: string
  expiresAt?: string
  sessionToken?: string
  requestId?: string
  isPaid?: boolean
  isActive?: boolean
  content?: {
    title: string
    description: string
    services: string[]
    testimonials: Array<{
      name: string
      text: string
      rating: number
    }>
    pricing: Array<{
      name: string
      price: string
      description: string
    }>
    contact: {
      email: string
      phone: string
      location: string
    }
  }
}

export class TrainerService {
  private static COLLECTION_NAME = "trainers"

  static async createTempTrainer(trainerData: Omit<TrainerData, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const tempId = nanoid()
      const sessionToken = nanoid()
      const now = new Date().toISOString()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

      const trainer: TrainerData = {
        ...trainerData,
        id: tempId,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        expiresAt,
        sessionToken,
        isPaid: false,
        isActive: false,
      }

      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      await setDoc(docRef, trainer)

      console.log("Created temp trainer:", tempId)
      return tempId
    } catch (error) {
      console.error("Error creating temp trainer:", error)
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerData | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData

        // Check if it's a pending trainer (temp trainer)
        if (data.status === "pending") {
          return { ...data, id: docSnap.id }
        }
      }

      return null
    } catch (error) {
      console.error("Error getting temp trainer:", error)
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<TrainerData | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, trainerId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData
        return { ...data, id: docSnap.id }
      }

      return null
    } catch (error) {
      console.error("Error getting trainer:", error)
      throw error
    }
  }

  static async activateTrainer(tempId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Trainer not found")
      }

      const trainer = docSnap.data() as TrainerData

      if (trainer.status !== "pending") {
        throw new Error("Trainer is not in pending status")
      }

      await updateDoc(docRef, {
        status: "active",
        isPaid: true,
        isActive: true,
        updatedAt: new Date().toISOString(),
      })

      console.log("Activated trainer:", tempId)
      return true
    } catch (error) {
      console.error("Error activating trainer:", error)
      throw error
    }
  }

  static async updateTrainerContent(trainerId: string, content: TrainerData["content"]): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, trainerId)
      await updateDoc(docRef, {
        content,
        updatedAt: new Date().toISOString(),
      })

      console.log("Updated trainer content:", trainerId)
      return true
    } catch (error) {
      console.error("Error updating trainer content:", error)
      throw error
    }
  }

  static async getAllActiveTrainers(): Promise<TrainerData[]> {
    try {
      const q = query(collection(db, this.COLLECTION_NAME), where("status", "==", "active"))

      const querySnapshot = await getDocs(q)
      const trainers: TrainerData[] = []

      querySnapshot.forEach((doc) => {
        trainers.push({ ...(doc.data() as TrainerData), id: doc.id })
      })

      return trainers
    } catch (error) {
      console.error("Error getting active trainers:", error)
      throw error
    }
  }

  static async cleanupExpiredTrainers(): Promise<void> {
    try {
      const now = new Date().toISOString()
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where("status", "==", "pending"),
        where("expiresAt", "<", now),
      )

      const querySnapshot = await getDocs(q)
      const deletePromises: Promise<void>[] = []

      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref))
      })

      await Promise.all(deletePromises)
      console.log(`Cleaned up ${deletePromises.length} expired trainers`)
    } catch (error) {
      console.error("Error cleaning up expired trainers:", error)
      throw error
    }
  }
}
