import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { TrainerFormData, TrainerContent } from "@/types/trainer"
import type { TempTrainer, Trainer } from "@/types/trainer"

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
  }
}

const firestoreDb = getFirestore()

export class TrainerService {
  static async createTempTrainer(trainerData: TempTrainer): Promise<string> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Starting createTempTrainer...")
    console.log("📋 [FIREBASE TRAINER SERVICE] Input data:", trainerData)

    try {
      // Check if Firebase is initialized
      console.log("🔍 [FIREBASE TRAINER SERVICE] Checking Firebase db connection...")
      if (!firestoreDb) {
        console.log("❌ [FIREBASE TRAINER SERVICE] Firebase db is not initialized")
        throw new Error("Firebase database is not initialized")
      }
      console.log("✅ [FIREBASE TRAINER SERVICE] Firebase db is available")

      // Check if we can access collections
      console.log("🔍 [FIREBASE TRAINER SERVICE] Testing collection access...")
      const tempTrainersRef = collection(firestoreDb, 'tempTrainers')
      console.log("✅ [FIREBASE TRAINER SERVICE] Collection reference created:", tempTrainersRef.path)

      // Prepare document data
      const docData = {
        ...trainerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      console.log("📄 [FIREBASE TRAINER SERVICE] Document data prepared:", docData)

      // Add document to Firestore
      console.log("💾 [FIREBASE TRAINER SERVICE] Adding document to Firestore...")
      const docRef = await addDoc(tempTrainersRef, docData)
      console.log("✅ [FIREBASE TRAINER SERVICE] Document added successfully with ID:", docRef.id)

      return docRef.id
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error in createTempTrainer:")
      console.log("Error type:", typeof error)
      console.log("Error constructor:", error?.constructor?.name)
      console.log("Error message:", error instanceof Error ? error.message : String(error))
      console.log("Error code:", (error as any)?.code)
      console.log("Error details:", (error as any)?.details)
      console.log("Full error:", error)

      // Re-throw with more context
      throw new Error(`Failed to create temp trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async getTempTrainer(tempId: string): Promise<TempTrainer | null> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Getting temp trainer:", tempId)
    
    try {
      if (!firestoreDb) {
        console.log("❌ [FIREBASE TRAINER SERVICE] Firebase db not initialized")
        throw new Error("Firebase database is not initialized")
      }

      const docRef = doc(firestoreDb, 'tempTrainers', tempId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("✅ [FIREBASE TRAINER SERVICE] Temp trainer found")
        return docSnap.data() as TempTrainer
      } else {
        console.log("❌ [FIREBASE TRAINER SERVICE] Temp trainer not found")
        return null
      }
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error getting temp trainer:", error)
      throw error
    }
  }

  static async updateTempTrainer(tempId: string, updates: Partial<TempTrainer>): Promise<void> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Updating temp trainer:", tempId, updates)
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const docRef = doc(firestoreDb, 'tempTrainers', tempId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      })
      console.log("✅ [FIREBASE TRAINER SERVICE] Temp trainer updated successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error updating temp trainer:", error)
      throw error
    }
  }

  static async deleteTempTrainer(tempId: string): Promise<void> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Deleting temp trainer:", tempId)
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const docRef = doc(firestoreDb, 'tempTrainers', tempId)
      await deleteDoc(docRef)
      console.log("✅ [FIREBASE TRAINER SERVICE] Temp trainer deleted successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error deleting temp trainer:", error)
      throw error
    }
  }

  static async getAllTempTrainers(): Promise<(TempTrainer & { id: string })[]> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Getting all temp trainers")
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const q = query(
        collection(firestoreDb, 'tempTrainers'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const trainers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (TempTrainer & { id: string })[]

      console.log("✅ [FIREBASE TRAINER SERVICE] Retrieved temp trainers:", trainers.length)
      return trainers
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error getting temp trainers:", error)
      throw error
    }
  }

  // Active trainer methods
  static async createTrainer(trainerData: Omit<Trainer, 'id'>): Promise<string> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Creating active trainer")
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const docData = {
        ...trainerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(firestoreDb, 'trainers'), docData)
      console.log("✅ [FIREBASE TRAINER SERVICE] Active trainer created:", docRef.id)
      return docRef.id
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error creating trainer:", error)
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<Trainer | null> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Getting trainer:", trainerId)
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const docRef = doc(firestoreDb, 'trainers', trainerId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("✅ [FIREBASE TRAINER SERVICE] Trainer found")
        return { id: docSnap.id, ...docSnap.data() } as Trainer
      } else {
        console.log("❌ [FIREBASE TRAINER SERVICE] Trainer not found")
        return null
      }
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error getting trainer:", error)
      throw error
    }
  }

  static async updateTrainer(trainerId: string, updates: Partial<Trainer>): Promise<void> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Updating trainer:", trainerId)
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const docRef = doc(firestoreDb, 'trainers', trainerId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      })
      console.log("✅ [FIREBASE TRAINER SERVICE] Trainer updated successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error updating trainer:", error)
      throw error
    }
  }

  static async getAllTrainers(): Promise<Trainer[]> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Getting all trainers")
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const q = query(
        collection(firestoreDb, 'trainers'),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const trainers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trainer[]

      console.log("✅ [FIREBASE TRAINER SERVICE] Retrieved trainers:", trainers.length)
      return trainers
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error getting trainers:", error)
      throw error
    }
  }

  static async getActiveTrainers(): Promise<Trainer[]> {
    console.log("🔥 [FIREBASE TRAINER SERVICE] Getting active trainers")
    
    try {
      if (!firestoreDb) {
        throw new Error("Firebase database is not initialized")
      }

      const q = query(
        collection(firestoreDb, 'trainers'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const trainers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trainer[]

      console.log("✅ [FIREBASE TRAINER SERVICE] Retrieved active trainers:", trainers.length)
      return trainers
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER SERVICE] Error getting active trainers:", error)
      throw error
    }
  }
}
