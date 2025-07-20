import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
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
  specialty: string
  certifications: string
  bio: string
  services: string[]
  status: "temp" | "active" | "inactive"
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
    gallery: string[]
    contact: {
      email: string
      phone: string
      location: string
    }
  }
}

export class TrainerService {
  private static COLLECTION_NAME = "trainers"

  // Generate content from trainer data
  private static generateTrainerContent(
    trainerData: Omit<TrainerData, "id" | "createdAt" | "updatedAt">,
  ): TrainerData["content"] {
    return {
      title: `${trainerData.fullName} - ${trainerData.specialty}`,
      description:
        trainerData.bio ||
        `Professional ${trainerData.specialty} trainer with ${trainerData.experience} of experience. Located in ${trainerData.location}.`,
      services:
        trainerData.services.length > 0
          ? trainerData.services
          : ["Personal Training Sessions", "Nutrition Coaching", "Workout Plan Design", "Progress Tracking"],
      testimonials: [
        {
          name: "Sarah M.",
          text: `Working with ${trainerData.fullName.split(" ")[0]} has been amazing! Their expertise in ${trainerData.specialty} really shows.`,
          rating: 5,
        },
        {
          name: "Mike R.",
          text: "Professional, knowledgeable, and gets results. Highly recommend!",
          rating: 5,
        },
        {
          name: "Lisa K.",
          text: `Great trainer with ${trainerData.experience} of experience. Really helped me reach my goals.`,
          rating: 5,
        },
      ],
      gallery: [
        "/placeholder.svg?height=300&width=400&text=Training+Session",
        "/placeholder.svg?height=300&width=400&text=Gym+Equipment",
        "/placeholder.svg?height=300&width=400&text=Success+Story",
      ],
      contact: {
        email: trainerData.email,
        phone: trainerData.phone,
        location: trainerData.location,
      },
    }
  }

  static async createTempTrainer(trainerData: Omit<TrainerData, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const tempId = nanoid()
      const now = new Date().toISOString()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

      // Generate content from form data
      const content = this.generateTrainerContent(trainerData)

      const docData: TrainerData = {
        ...trainerData,
        id: tempId,
        status: "temp", // Use "temp" instead of "pending"
        createdAt: now,
        updatedAt: now,
        expiresAt,
        sessionToken: nanoid(),
        requestId: nanoid(),
        content, // Add generated content
      }

      console.log("Creating temp trainer with data:", docData)

      await setDoc(doc(db, this.COLLECTION_NAME, tempId), docData)
      return tempId
    } catch (error) {
      console.error("Error creating temp trainer:", error)
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerData | null> {
    try {
      console.log("Getting temp trainer:", tempId)

      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData

        console.log("Document data:", data)
        console.log("Document status:", data.status)

        // Check if it's a temp trainer (status: "temp")
        if (data.status === "temp") {
          // Check if expired
          if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
            console.log("Trainer expired, deleting...")
            await this.deleteTempTrainer(tempId)
            return null
          }
          console.log("Returning temp trainer data")
          return { id: tempId, ...data }
        } else {
          console.log("Document status is not 'temp':", data.status)
        }
      } else {
        console.log("Document does not exist")
      }

      return null
    } catch (error) {
      console.error("Error getting temp trainer:", error)
      throw error
    }
  }

  static async activateTrainer(tempId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData

        if (data.status === "temp") {
          await updateDoc(docRef, {
            status: "active",
            isActive: true,
            isPaid: true,
            updatedAt: new Date().toISOString(),
            expiresAt: null, // Remove expiration
            sessionToken: null, // Remove session token
          })
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error activating trainer:", error)
      throw error
    }
  }

  static async deleteTempTrainer(tempId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, tempId))
      return true
    } catch (error) {
      console.error("Error deleting temp trainer:", error)
      throw error
    }
  }

  static async getActiveTrainer(id: string): Promise<TrainerData | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData

        // Only return if it's an active trainer
        if (data.status === "active") {
          return { id, ...data }
        }
      }

      return null
    } catch (error) {
      console.error("Error getting active trainer:", error)
      throw error
    }
  }

  static async updateTrainerContent(id: string, content: TrainerData["content"]): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id)
      await updateDoc(docRef, {
        content,
        updatedAt: new Date().toISOString(),
      })
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
        trainers.push({ id: doc.id, ...doc.data() } as TrainerData)
      })

      return trainers
    } catch (error) {
      console.error("Error getting active trainers:", error)
      throw error
    }
  }
}
