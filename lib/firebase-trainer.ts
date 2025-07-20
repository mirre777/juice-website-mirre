import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { logger } from "@/lib/logger"
import { nanoid } from "nanoid"

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
  content?: any
  isActive?: boolean
  isPaid?: boolean
  sessionToken?: string
  requestId?: string
  expiresAt?: any
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

      // Generate session token for temporary access
      const sessionToken = nanoid()

      // Set expiration to 24 hours from now
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Prepare trainer data - store in trainers collection with pending status
      const trainerData = {
        ...data,
        status: "pending" as const,
        isActive: false,
        isPaid: false,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      logger.info("Prepared trainer data", {
        email: data.email,
        fullName: data.fullName,
        hasServices: !!data.services,
        servicesCount: data.services?.length || 0,
        sessionToken: sessionToken.substring(0, 8) + "...",
      })

      // Create document in trainers collection
      logger.info("Adding document to trainers collection")
      const docRef = await db.collection("trainers").add(trainerData)
      logger.info("Document added successfully", { docId: docRef.id })

      // Verify the document was created
      const verifyDoc = await db.collection("trainers").doc(docRef.id).get()
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
        sessionToken: sessionToken.substring(0, 8) + "...",
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

      // Get from trainers collection
      const doc = await db.collection("trainers").doc(tempId).get()

      if (!doc.exists) {
        logger.warn("Trainer not found", { tempId })
        return null
      }

      const data = doc.data()
      const result = { id: doc.id, ...data } as TrainerData

      // Check if it's a pending trainer (temp trainer)
      if (result.status !== "pending") {
        logger.warn("Trainer is not in pending status", { tempId, status: result.status })
        // Still return it, but log the status
      }

      // Check expiration for pending trainers
      if (result.status === "pending" && result.expiresAt) {
        const expiresAt = new Date(result.expiresAt)
        if (expiresAt < new Date()) {
          logger.warn("Temp trainer has expired", { tempId, expiresAt: result.expiresAt })
          return null
        }
      }

      logger.info("=== TrainerService.getTempTrainer SUCCESS ===", {
        tempId,
        email: result.email,
        fullName: result.fullName,
        status: result.status,
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

      // Get trainer data
      const trainer = await this.getTempTrainer(tempId)
      if (!trainer) {
        throw new Error("Trainer not found")
      }

      // Update the same document to active status
      const updateData = {
        status: "active" as const,
        isActive: true,
        isPaid: true,
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Remove session token and expiration since it's now active
        sessionToken: null,
        expiresAt: null,
      }

      await db.collection("trainers").doc(tempId).update(updateData)

      logger.info("=== TrainerService.activateTrainer SUCCESS ===", {
        tempId,
        email: trainer.email,
      })

      return tempId // Return the same ID since we're updating in place
    } catch (error) {
      logger.error("=== TrainerService.activateTrainer ERROR ===", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<TrainerData | null> {
    try {
      logger.info("=== TrainerService.getTrainer CALLED ===", { trainerId })

      if (!hasRealFirebaseConfig()) {
        throw new Error("Firebase configuration is incomplete")
      }

      if (!db) {
        throw new Error("Database not initialized")
      }

      const doc = await db.collection("trainers").doc(trainerId).get()

      if (!doc.exists) {
        logger.warn("Trainer not found", { trainerId })
        return null
      }

      const data = doc.data()
      const result = { id: doc.id, ...data } as TrainerData

      logger.info("=== TrainerService.getTrainer SUCCESS ===", {
        trainerId,
        email: result.email,
        fullName: result.fullName,
        status: result.status,
      })

      return result
    } catch (error) {
      logger.error("=== TrainerService.getTrainer ERROR ===", {
        trainerId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}
