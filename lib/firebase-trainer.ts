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
  experience: string
  specialty: string
  certifications: string
  status: "temp" | "active"
  createdAt: string
  updatedAt?: string
  expiresAt?: string
  sessionToken?: string
  requestId?: string
  isPaid: boolean
  isActive: boolean
  content: {
    about: {
      title: string
      content: string
    }
    contact: {
      title: string
      description: string
      email: string
      phone: string
      location: string
    }
    customization: {
      isDraft: boolean
      lastUpdated: string
      version: number
    }
  }
}

export class TrainerService {
  private static COLLECTION_NAME = "trainers"

  static async createTempTrainer(formData: {
    fullName: string
    email: string
    phone: string
    location: string
    experience: string
    specialty: string
    certifications: string
    bio: string
    services: string[]
  }): Promise<string> {
    try {
      const tempId = nanoid()
      const now = new Date().toISOString()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

      const docData: TrainerData = {
        id: tempId,
        fullName: formData.fullName,
        email: formData.email,
        experience: formData.experience,
        specialty: formData.specialty,
        certifications: formData.certifications || "",
        status: "temp",
        createdAt: now,
        updatedAt: now,
        expiresAt,
        sessionToken: nanoid(),
        requestId: nanoid(),
        isPaid: false,
        isActive: false,
        content: {
          about: {
            title: `About ${formData.fullName}`,
            content:
              formData.bio ||
              `Passionate ${formData.specialty} trainer with ${formData.experience} of experience helping clients achieve their health and fitness goals.`,
          },
          contact: {
            title: "Let's Start Your Fitness Journey",
            description:
              "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
          },
          customization: {
            isDraft: false,
            lastUpdated: now,
            version: 1,
          },
        },
      }

      await setDoc(doc(db, this.COLLECTION_NAME, tempId), docData)
      return tempId
    } catch (error) {
      console.error("Error creating temp trainer:", error)
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerData | null> {
    try {
      console.log("=== GET TEMP TRAINER ===")
      console.log("Fetching trainer with ID:", tempId)

      const docRef = doc(db, this.COLLECTION_NAME, tempId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TrainerData
        console.log("Document exists, status:", data.status)

        // Return both temp and active trainers for payment page
        if (data.status === "temp" || data.status === "active") {
          // Check if expired (only for temp trainers)
          if (data.status === "temp" && data.expiresAt && new Date(data.expiresAt) < new Date()) {
            console.log("❌ Trainer expired, deleting...")
            await this.deleteTempTrainer(tempId)
            return null
          }
          console.log("✅ Returning trainer data")
          return { id: tempId, ...data }
        } else {
          console.log("❌ Trainer status not temp or active:", data.status)
        }
      } else {
        console.log("❌ Document does not exist")
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
        content: {
          ...content,
          customization: {
            ...content.customization,
            lastUpdated: new Date().toISOString(),
            version: (content.customization?.version || 0) + 1,
          },
        },
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
