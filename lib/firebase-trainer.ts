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

      // Prepare trainer data
      const trainerData = {
        ...data,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      logger.info("Creating temp trainer with data", {
        email: data.email,
        fullName: data.fullName,
      })

      // Create document in temp_trainers collection
      const docRef = await db.collection("temp_trainers").add(trainerData)

      logger.info("Successfully created temp trainer", {
        tempId: docRef.id,
        email: data.email,
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

      const doc = await db.collection("temp_trainers").doc(tempId).get()

      if (!doc.exists) {
        logger.warn("Temp trainer not found", { tempId })
        return null
      }

      const data = doc.data()
      return { id: doc.id, ...data } as TrainerData
    } catch (error) {
      logger.error("Error in getTempTrainer", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async activateTrainer(tempId: string): Promise<string> {
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
        throw new Error("Temp trainer not found")
      }

      // Create active trainer
      const activeTrainerData = {
        ...tempTrainer,
        status: "active" as const,
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const activeDocRef = await db.collection("trainers").add(activeTrainerData)

      // Delete temp trainer
      await db.collection("temp_trainers").doc(tempId).delete()

      logger.info("Successfully activated trainer", {
        tempId,
        activeId: activeDocRef.id,
        email: tempTrainer.email,
      })

      return activeDocRef.id
    } catch (error) {
      logger.error("Error in activateTrainer", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}
