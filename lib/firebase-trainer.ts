import { getAdminDb, hasFirebaseConfig } from "@/app/api/firebase-config"

export interface TrainerFormData {
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services?: string[]
}

export interface TrainerDocument extends TrainerFormData {
  id: string
  status: "temp" | "active" | "inactive"
  createdAt: Date | string
  updatedAt: Date | string
  activatedAt?: Date | string
  expiresAt?: Date | string
  sessionToken?: string
  paymentIntentId?: string
}

export class TrainerService {
  static async createTempTrainer(formData: TrainerFormData): Promise<string> {
    try {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration missing")
      }

      const db = await getAdminDb()
      if (!db) {
        throw new Error("Database not available")
      }

      // Generate unique temp ID and session token
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const sessionToken = Math.random().toString(36).substr(2, 15)

      // Set expiration to 24 hours
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const trainerData = {
        ...formData,
        id: tempId,
        status: "temp" as const,
        sessionToken,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.collection("trainers").doc(tempId).set(trainerData)

      console.log("Created temp trainer:", tempId)
      return tempId
    } catch (error) {
      console.error("Error creating temp trainer:", error)
      throw new Error("Failed to create trainer profile")
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerDocument | null> {
    try {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration missing")
      }

      const db = await getAdminDb()
      if (!db) {
        throw new Error("Database not available")
      }

      const doc = await db.collection("trainers").doc(tempId).get()

      if (!doc.exists) {
        console.log("Temp trainer not found:", tempId)
        return null
      }

      const data = doc.data()

      // Check if expired
      if (data.expiresAt) {
        const expiresAt = new Date(data.expiresAt)
        if (expiresAt < new Date()) {
          console.log("Temp trainer expired:", tempId)
          return null
        }
      }

      return {
        ...data,
        id: doc.id,
      } as TrainerDocument
    } catch (error) {
      console.error("Error getting temp trainer:", error)
      throw new Error("Failed to load trainer")
    }
  }

  static async activateTrainer(tempId: string, paymentIntentId: string): Promise<string> {
    try {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration missing")
      }

      const db = await getAdminDb()
      if (!db) {
        throw new Error("Database not available")
      }

      // Get temp trainer
      const tempTrainer = await this.getTempTrainer(tempId)
      if (!tempTrainer) {
        throw new Error("Temp trainer not found")
      }

      // Generate permanent ID
      const permanentId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create activated trainer
      const activatedData = {
        ...tempTrainer,
        id: permanentId,
        status: "active" as const,
        paymentIntentId,
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Remove temp fields
        sessionToken: null,
        expiresAt: null,
      }

      // Save activated trainer
      await db.collection("trainers").doc(permanentId).set(activatedData)

      // Update temp trainer status
      await db.collection("trainers").doc(tempId).update({
        status: "processed",
        paymentIntentId,
        updatedAt: new Date().toISOString(),
      })

      console.log("Activated trainer:", permanentId)
      return permanentId
    } catch (error) {
      console.error("Error activating trainer:", error)
      throw new Error("Failed to activate trainer")
    }
  }

  static async getActiveTrainer(trainerId: string): Promise<TrainerDocument | null> {
    try {
      if (!hasFirebaseConfig()) {
        throw new Error("Firebase configuration missing")
      }

      const db = await getAdminDb()
      if (!db) {
        throw new Error("Database not available")
      }

      const doc = await db.collection("trainers").doc(trainerId).get()

      if (!doc.exists) {
        return null
      }

      const data = doc.data()

      if (data.status !== "active") {
        return null
      }

      return {
        ...data,
        id: doc.id,
      } as TrainerDocument
    } catch (error) {
      console.error("Error getting active trainer:", error)
      throw new Error("Failed to load trainer")
    }
  }
}
