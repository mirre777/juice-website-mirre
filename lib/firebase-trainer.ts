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
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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
  createdAt?: any
  updatedAt?: any
}

export interface Trainer extends TempTrainer {
  id: string
  isActive: boolean
  activatedAt?: any
  paymentStatus?: 'pending' | 'completed' | 'failed'
  websiteUrl?: string
}

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  console.log('🔥 [FIREBASE ADMIN] Initializing Firebase Admin SDK...')
  
  // Check if we have the required environment variables
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL', 
    'FIREBASE_PRIVATE_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ [FIREBASE ADMIN] Missing required environment variables:', missingVars)
    throw new Error(`Missing Firebase Admin environment variables: ${missingVars.join(', ')}`)
  }
  
  console.log('✅ [FIREBASE ADMIN] All required environment variables present')
  
  // Check if Firebase Admin is already initialized
  if (getApps().length > 0) {
    console.log('✅ [FIREBASE ADMIN] Firebase Admin already initialized')
    return getApps()[0]
  }
  
  try {
    // Initialize Firebase Admin with service account
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
    
    console.log('🎉 [FIREBASE ADMIN] Firebase Admin initialized successfully!')
    return app
  } catch (error) {
    console.error('💥 [FIREBASE ADMIN] Failed to initialize Firebase Admin:', error)
    throw error
  }
}

// Get Firestore instance
function getFirestoreAdmin() {
  console.log('🔍 [FIREBASE ADMIN] Getting Firestore instance...')
  
  try {
    const app = initializeFirebaseAdmin()
    const db = getFirestore(app)
    
    console.log('✅ [FIREBASE ADMIN] Firestore instance obtained successfully')
    return db
  } catch (error) {
    console.error('💥 [FIREBASE ADMIN] Failed to get Firestore instance:', error)
    throw error
  }
}

export class TrainerService {
  private static readonly TEMP_COLLECTION = 'temp_trainers'
  private static readonly TRAINERS_COLLECTION = 'trainers'

  static async createTempTrainer(trainerData: any) {
    console.log('🚀 [TRAINER SERVICE] Creating temp trainer...')
    console.log('📋 [TRAINER SERVICE] Input data:', trainerData)
    
    try {
      const db = getFirestoreAdmin()
      console.log('✅ [TRAINER SERVICE] Firestore connection established')
      
      // Prepare document data
      const docData = {
        ...trainerData,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 hours from now
        status: 'pending'
      }
      
      console.log('📄 [TRAINER SERVICE] Document data prepared:', docData)
      
      // Add document to Firestore
      console.log('💾 [TRAINER SERVICE] Adding document to temp_trainers collection...')
      const docRef = await db.collection('temp_trainers').add(docData)
      
      console.log('🎉 [TRAINER SERVICE] Document created successfully with ID:', docRef.id)
      
      return {
        success: true,
        id: docRef.id,
        redirectUrl: `/marketplace/trainer/temp/${docRef.id}`
      }
    } catch (error) {
      console.error('💥 [TRAINER SERVICE] Error creating temp trainer:', error)
      throw error
    }
  }

  static async getTempTrainer(id: string): Promise<TempTrainer | null> {
    console.log("🔥 [FIREBASE TRAINER] Getting temp trainer with ID:", id)

    try {
      const db = getFirestoreAdmin()
      const docRef = db.collection(this.TEMP_COLLECTION).doc(id)
      const docSnap = await docRef.get()

      console.log("🔍 [FIREBASE TRAINER] Document snapshot obtained, checking exists property...")
      console.log("📋 [FIREBASE TRAINER] Document exists:", docSnap.exists)

      if (docSnap.exists) {
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
      const db = getFirestoreAdmin()
      const docRef = db.collection(this.TEMP_COLLECTION).doc(id)
      await docRef.update({
        ...updates,
        updatedAt: new Date(),
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
      const db = getFirestoreAdmin()
      const docRef = db.collection(this.TEMP_COLLECTION).doc(id)
      await docRef.delete()

      console.log("✅ [FIREBASE TRAINER] Temp trainer deleted successfully")
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error deleting temp trainer:", error)
      throw new Error(`Failed to delete temp trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async activateTrainer(tempId: string): Promise<string> {
    console.log("🔥 [FIREBASE TRAINER] Activating trainer from temp ID:", tempId)

    try {
      const db = getFirestoreAdmin()
      // Get temp trainer data
      const tempTrainer = await this.getTempTrainer(tempId)
      if (!tempTrainer) {
        throw new Error('Temp trainer not found')
      }

      // Create active trainer
      const trainerData: any = {
        ...tempTrainer,
        isActive: true,
        activatedAt: new Date(),
        paymentStatus: 'completed',
      }

      const trainersRef = db.collection(this.TRAINERS_COLLECTION)
      const docRef = await trainersRef.add(trainerData)

      // Delete temp trainer
      await this.deleteTempTrainer(tempId)

      console.log("✅ [FIREBASE TRAINER] Trainer activated successfully with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error activating trainer:", error)
      throw new Error(`Failed to activate trainer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  static async getTrainer(id: string): Promise<any | null> {
    console.log("🔥 [FIREBASE TRAINER] Getting trainer with ID:", id)

    try {
      const db = getFirestoreAdmin()
      const docRef = db.collection(this.TRAINERS_COLLECTION).doc(id)
      const docSnap = await docRef.get()

      if (docSnap.exists) {
        const data = docSnap.data()
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

  static async getAllTrainers(): Promise<any[]> {
    console.log("🔥 [FIREBASE TRAINER] Getting all trainers...")

    try {
      const db = getFirestoreAdmin()
      const trainersRef = db.collection(this.TRAINERS_COLLECTION)
      const q = trainersRef.where('isActive', '==', true).orderBy('createdAt', 'desc')
      const querySnapshot = await q.get()

      const trainers: any[] = []
      querySnapshot.forEach((doc) => {
        trainers.push({ ...doc.data(), id: doc.id })
      })

      console.log("✅ [FIREBASE TRAINER] Found trainers:", trainers.length)
      return trainers
    } catch (error) {
      console.log("💥 [FIREBASE TRAINER] Error getting all trainers:", error)
      throw new Error(`Failed to get trainers: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
