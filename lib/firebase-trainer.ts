import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/firebase'

export interface TempTrainer {
  id?: string
  fullName: string
  email: string
  phone: string
  city: string
  district: string
  specialty: string
  certifications: string
  bio: string
  services: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Trainer extends TempTrainer {
  id: string
  isActive: boolean
  activatedAt?: Timestamp
  paymentStatus?: 'pending' | 'completed' | 'failed'
  websiteUrl?: string
}

export class TrainerService {
  private static readonly TEMP_COLLECTION = 'temp_trainers'
  private static readonly TRAINERS_COLLECTION = 'trainers'

  static async createTempTrainer(trainerData: Omit<TempTrainer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log("🔥 [FIREBASE TRAINER] Starting createTempTrainer...")
    console.log("📋 [FIREBASE TRAINER] Input data:", trainerData)

    try {
      // Check if Firebase is initialized
      console.log("🔍 [FIREBASE TRAINER] Checking Firebase db connection...")
      if (!db) {
        console.log("❌ [FIREBASE TRAINER] Firebase db is not initialized")
        throw new Error('Firebase database is not initialized')
      }
      console.log("✅ [FIREBASE TRAINER] Firebase db is available")

      // Check if collection function is available
      console.log("🔍 [FIREBASE TRAINER] Checking Firestore collection function...")
      if (typeof collection !== 'function') {
        console.log("❌ [FIREBASE TRAINER] Firestore collection function not available")
        throw new Error('Firestore collection function is not available')
      }
      console.log("✅ [FIREBASE TRAINER] Firestore collection function is available")

      // Get collection reference
      console.log("🔍 [FIREBASE TRAINER] Getting collection reference...")
      const tempTrainersRef = collection(db, this.TEMP_COLLECTION)
      console.log("✅ [FIREBASE TRAINER] Collection reference obtained:", this.TEMP_COLLECTION)

      // Prepare document data
      const docData = {
        ...trainerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      console.log("📋 [FIREBASE TRAINER] Document data prepared:", docData)

      // Check if addDoc function is available
      console.log("🔍 [FIREBASE TRAINER] Checking Firestore addDoc function...")
      if (typeof addDoc !== 'function') {
        console.log("❌ [FIREBASE TRAINER] Firestore addDoc function not available")
        throw new Error('Firestore addDoc function is not available')
      }
      console.log("✅ [FIREBASE TRAINER] Firestore addDoc function is available")

      // Add document to Firestore
      console.log("🚀 [FIREBASE TRAINER] Adding document to Firestore...")
      const docRef = await addDoc(tempTrainersRef, docData)
      console.log("✅ [FIREBASE TRAINER] Document added successfully with ID:", docRef.id)

      return docRef.id
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error in createTempTrainer:")
      console.log("Error type:", typeof error)
      console.log("Error constructor:", error?.constructor?.name)
      console.log("Error message:", error instanceof Error ? error.message : String(error))
      console.log("Error stack:", error instanceof Error ? error.stack : "No stack trace")
      console.log("Full error object:", error)

      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Failed to create temp trainer: ${error.message}`)
      } else {
        throw new Error(`Failed to create temp trainer: ${String(error)}`)
      }
    }
  }

  static async getTempTrainer(id: string): Promise<TempTrainer | null> {
    console.log("🔥 [FIREBASE TRAINER] Getting temp trainer with ID:", id)

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      const docRef = doc(db, this.TEMP_COLLECTION, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as TempTrainer
        console.log("✅ [FIREBASE TRAINER] Temp trainer found:", data)
        return { ...data, id: docSnap.id }
      } else {
        console.log("❌ [FIREBASE TRAINER] Temp trainer not found")
        return null
      }
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error getting temp trainer:", error)
      throw new Error(`Failed to get temp trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async updateTempTrainer(id: string, updates: Partial<TempTrainer>): Promise<void> {
    console.log("🔥 [FIREBASE TRAINER] Updating temp trainer:", id, updates)

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      const docRef = doc(db, this.TEMP_COLLECTION, id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      console.log("✅ [FIREBASE TRAINER] Temp trainer updated successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error updating temp trainer:", error)
      throw new Error(`Failed to update temp trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async deleteTempTrainer(id: string): Promise<void> {
    console.log("🔥 [FIREBASE TRAINER] Deleting temp trainer:", id)

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      const docRef = doc(db, this.TEMP_COLLECTION, id)
      await deleteDoc(docRef)

      console.log("✅ [FIREBASE TRAINER] Temp trainer deleted successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error deleting temp trainer:", error)
      throw new Error(`Failed to delete temp trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async activateTrainer(tempId: string): Promise<string> {
    console.log("🔥 [FIREBASE TRAINER] Activating trainer from temp ID:", tempId)

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      // Get temp trainer data
      const tempTrainer = await this.getTempTrainer(tempId)
      if (!tempTrainer) {
        throw new Error('Temp trainer not found')
      }

      // Create active trainer
      const trainerData: Omit<Trainer, 'id'> = {
        ...tempTrainer,
        isActive: true,
        activatedAt: serverTimestamp() as Timestamp,
        paymentStatus: 'completed',
      }

      const trainersRef = collection(db, this.TRAINERS_COLLECTION)
      const docRef = await addDoc(trainersRef, trainerData)

      // Delete temp trainer
      await this.deleteTempTrainer(tempId)

      console.log("✅ [FIREBASE TRAINER] Trainer activated successfully with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error activating trainer:", error)
      throw new Error(`Failed to activate trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async getTrainer(id: string): Promise<Trainer | null> {
    console.log("🔥 [FIREBASE TRAINER] Getting trainer with ID:", id)

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      const docRef = doc(db, this.TRAINERS_COLLECTION, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Trainer
        console.log("✅ [FIREBASE TRAINER] Trainer found:", data)
        return { ...data, id: docSnap.id }
      } else {
        console.log("❌ [FIREBASE TRAINER] Trainer not found")
        return null
      }
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error getting trainer:", error)
      throw new Error(`Failed to get trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async getAllTrainers(): Promise<Trainer[]> {
    console.log("🔥 [FIREBASE TRAINER] Getting all trainers...")

    try {
      if (!db) {
        throw new Error('Firebase database is not initialized')
      }

      const trainersRef = collection(db, this.TRAINERS_COLLECTION)
      const q = query(trainersRef, where('isActive', '==', true), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const trainers: Trainer[] = []
      querySnapshot.forEach((doc) => {
        trainers.push({ ...doc.data() as Trainer, id: doc.id })
      })

      console.log("✅ [FIREBASE TRAINER] Found trainers:", trainers.length)
      return trainers
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error getting all trainers:", error)
      throw new Error(`Failed to get trainers: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
