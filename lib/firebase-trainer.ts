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
      logger.info("=== TrainerService.createTempTrainer CALLED ===", {
        email: data.email,
        fullName: data.fullName,
      })

      // Check Firebase configuration
      if (!hasRealFirebaseConfig()) {
        logger.error("Firebase configuration is incomplete")
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        logger.error("Database not initialized")
        throw new Error("Database not initialized")
      }

      // Prepare trainer data
      const trainerData = {
        ...data,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      logger.info("Prepared trainer data", {
        email: data.email,
        fullName: data.fullName,
        hasServices: !!data.services,
        servicesCount: data.services?.length || 0,
      })

      // Create document in temp_trainers collection
      logger.info("Adding document to temp_trainers collection")
      const docRef = await db.collection("temp_trainers").add(trainerData)
      logger.info("Document added successfully", { docId: docRef.id })

      // Verify the document was created
      const verifyDoc = await db.collection("temp_trainers").doc(docRef.id).get()
      if (!verifyDoc.exists) {
        logger.error("Document verification failed - document does not exist", { docId: docRef.id })
        throw new Error("Failed to verify document creation")
      }

      logger.info("Document verified successfully", {
        docId: docRef.id,
        email: data.email,
        fullName: data.fullName,
      })

      logger.info("=== TrainerService.createTempTrainer SUCCESS ===", {
        tempId: docRef.id,
        email: data.email,
      })

      return docRef.id
    } catch (error) {
      logger.error("=== TrainerService.createTempTrainer ERROR ===", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        email: data.email,
      })
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerData | null> {
    try {
      logger.info("=== TrainerService.getTempTrainer CALLED ===", { tempId })

      if (!hasRealFirebaseConfig()) {
        logger.error("Firebase configuration is incomplete")
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        logger.error("Database not initialized")
        throw new Error("Database not initialized")
      }

      const doc = await db.collection("temp_trainers").doc(tempId).get()

      if (!doc.exists) {
        logger.warn("Temp trainer not found", { tempId })
        return null
      }

      const data = doc.data()
      const result = { id: doc.id, ...data } as TrainerData

      logger.info("=== TrainerService.getTempTrainer SUCCESS ===", {
        tempId,
        email: result.email,
        fullName: result.fullName,
      })

      return result
    } catch (error) {
      logger.error("=== TrainerService.getTempTrainer ERROR ===", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async activateTrainer(tempId: string): Promise<string> {
    try {
      logger.info("=== TrainerService.activateTrainer CALLED ===", { tempId })

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

      logger.info("=== TrainerService.activateTrainer SUCCESS ===", {
        tempId,
        activeId: activeDocRef.id,
        email: tempTrainer.email,
      })

      return activeDocRef.id
    } catch (error) {
      logger.error("=== TrainerService.activateTrainer ERROR ===", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}
