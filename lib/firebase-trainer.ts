import { db } from "@/firebase"
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import type { TrainerData, TrainerContent, Service } from "@/types/trainer"
import { logger } from "@/lib/logger"

export class TrainerService {
  private static readonly COLLECTION = "trainers"

  static async createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const trainerId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newTrainer: TrainerData = {
        ...trainerData,
        id: trainerId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: "temp",
      }

      await setDoc(doc(db, this.COLLECTION, trainerId), newTrainer)

      logger.info("Trainer created successfully", { trainerId })
      return trainerId
    } catch (error) {
      logger.error("Error creating trainer", { error })
      throw new Error("Failed to create trainer")
    }
  }

  static async getTrainer(trainerId: string): Promise<TrainerData | null> {
    try {
      const trainerDoc = await getDoc(doc(db, this.COLLECTION, trainerId))

      if (!trainerDoc.exists()) {
        return null
      }

      const data = trainerDoc.data() as TrainerData
      return { ...data, id: trainerDoc.id }
    } catch (error) {
      logger.error("Error fetching trainer", { error, trainerId })
      throw new Error("Failed to fetch trainer")
    }
  }

  static async updateTrainerStatus(trainerId: string, status: "temp" | "active"): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.COLLECTION, trainerId), {
        status,
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer status updated", { trainerId, status })
      return true
    } catch (error) {
      logger.error("Error updating trainer status", { error, trainerId })
      throw new Error("Failed to update trainer status")
    }
  }

  static async updateTrainerContent(trainerId: string, content: Partial<TrainerContent>): Promise<TrainerData | null> {
    try {
      const trainer = await this.getTrainer(trainerId)
      if (!trainer) {
        return null
      }

      // Generate default content if not provided
      const defaultContent = this.generateDefaultContent(trainer)

      const updatedContent = {
        ...defaultContent,
        ...content,
        contentVersion: (trainer.contentVersion || 0) + 1,
        lastContentUpdate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await updateDoc(doc(db, this.COLLECTION, trainerId), updatedContent)

      logger.info("Trainer content updated", { trainerId, contentVersion: updatedContent.contentVersion })

      // Return updated trainer
      return await this.getTrainer(trainerId)
    } catch (error) {
      logger.error("Error updating trainer content", { error, trainerId })
      throw new Error("Failed to update trainer content")
    }
  }

  static generateDefaultContent(trainer: TrainerData): TrainerContent {
    const defaultServices: Service[] = [
      {
        id: "service_1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session tailored to your fitness goals.",
        price: 60,
        duration: "60 minutes",
      },
      {
        id: "service_2",
        title: "Consultation",
        description: "Initial consultation to discuss your goals and create a personalized plan.",
        price: 30,
        duration: "30 minutes",
      },
    ]

    return {
      heroTitle: `${trainer.firstName} ${trainer.lastName}`,
      heroSubtitle: `Professional ${trainer.specialization} Trainer`,
      aboutTitle: "About Me",
      aboutContent: `Hi, I'm ${trainer.firstName}! I'm a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping people achieve their fitness goals and live healthier lives.`,
      services: defaultServices,
      contactTitle: "Get In Touch",
      contactContent: "Ready to start your fitness journey? Contact me to schedule your first session!",
      seoTitle: `${trainer.firstName} ${trainer.lastName} - ${trainer.specialization} Trainer in ${trainer.location}`,
      seoDescription: `Professional ${trainer.specialization} trainer in ${trainer.location}. ${trainer.experience} of experience helping clients achieve their fitness goals.`,
    }
  }

  static async getTrainerByTempId(tempId: string): Promise<TrainerData | null> {
    try {
      const q = query(collection(db, this.COLLECTION), where("tempId", "==", tempId))

      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      const data = doc.data() as TrainerData
      return { ...data, id: doc.id }
    } catch (error) {
      logger.error("Error fetching trainer by temp ID", { error, tempId })
      throw new Error("Failed to fetch trainer")
    }
  }

  static async getAllActiveTrainers(): Promise<TrainerData[]> {
    try {
      const q = query(collection(db, this.COLLECTION), where("status", "==", "active"))

      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        ...(doc.data() as TrainerData),
        id: doc.id,
      }))
    } catch (error) {
      logger.error("Error fetching active trainers", { error })
      throw new Error("Failed to fetch trainers")
    }
  }
}
