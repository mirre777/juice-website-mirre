import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
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
  services?: string[]
  hourlyRate?: number
  availability?: string[]
  profileImage?: string
  status?: "pending" | "active" | "inactive"
  createdAt?: any
  updatedAt?: any
  expiresAt?: any
  sessionToken?: string
}

export class TrainerService {
  static async createTempTrainer(data: TrainerData): Promise<string> {
    try {
      // Check Firebase configuration
      if (!hasRealFirebaseConfig()) {
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        throw new Error("Database not initialized")
      }

      // Generate session token for secure access
      const sessionToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)

      // Set expiration to 24 hours from now
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Prepare trainer data
      const trainerData = {
        ...data,
        status: "pending" as const,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      logger.info("Creating temp trainer with data", {
        email: data.email,
        fullName: data.fullName,
      })

      // Create document in trainers collection with temp status
      const docRef = await db.collection("trainers").add(trainerData)

      logger.info("Successfully created temp trainer", {
        tempId: docRef.id,
        email: data.email,
        expiresAt: expiresAt.toISOString(),
      })

      return docRef.id
    } catch (error) {
      logger.error("Error in createTempTrainer", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerData | null> {
    try {
      if (!hasRealFirebaseConfig()) {
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        throw new Error("Database not initialized")
      }

      const doc = await db.collection("trainers").doc(tempId).get()

      if (!doc.exists) {
        logger.warn("Temp trainer document not found", { tempId })
        return null
      }

      const data = doc.data()
      if (!data) {
        logger.warn("Temp trainer data is empty", { tempId })
        return null
      }

      // Check if trainer has expired
      if (data.expiresAt) {
        const expiresAt = new Date(data.expiresAt)
        if (expiresAt < new Date()) {
          logger.warn("Temp trainer has expired", { tempId, expiresAt })
          return null
        }
      }

      return { id: doc.id, ...data } as TrainerData
    } catch (error) {
      logger.error("Error in getTempTrainer", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async activateTrainer(tempId: string, paymentIntentId: string): Promise<string> {
    try {
      if (!hasRealFirebaseConfig()) {
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        throw new Error("Database not initialized")
      }

      // Get temp trainer data
      const tempTrainer = await this.getTempTrainer(tempId)
      if (!tempTrainer) {
        throw new Error("Temp trainer not found or expired")
      }

      // Update trainer to active status
      const updateData = {
        status: "active" as const,
        paymentIntentId,
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Remove temporary fields
        sessionToken: null,
        expiresAt: null,
      }

      await db.collection("trainers").doc(tempId).update(updateData)

      logger.info("Successfully activated trainer", {
        tempId,
        email: tempTrainer.email,
        paymentIntentId,
      })

      return tempId
    } catch (error) {
      logger.error("Error in activateTrainer", {
        tempId,
        paymentIntentId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async getActiveTrainer(trainerId: string): Promise<TrainerData | null> {
    try {
      if (!hasRealFirebaseConfig()) {
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        throw new Error("Database not initialized")
      }

      const doc = await db.collection("trainers").doc(trainerId).get()

      if (!doc.exists) {
        return null
      }

      const data = doc.data()
      if (!data || data.status !== "active") {
        return null
      }

      return { id: doc.id, ...data } as TrainerData
    } catch (error) {
      logger.error("Error in getActiveTrainer", {
        trainerId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}
