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
import { db } from "@/firebase"
import type { Trainer, TrainerContent, Service } from "@/types/trainer"
import { logger } from "@/lib/logger"

export class TrainerService {
  private static readonly COLLECTION = "trainers"

  static async createTrainer(trainerData: Omit<Trainer, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const trainerId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const trainer: Trainer = {
        ...trainerData,
        id: trainerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: this.generateDefaultContent(trainerData),
      }

      await setDoc(doc(db, this.COLLECTION, trainerId), {
        ...trainer,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer created successfully", { trainerId })
      return trainerId
    } catch (error) {
      logger.error("Error creating trainer", { error })
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<Trainer | null> {
    try {
      const docRef = doc(db, this.COLLECTION, trainerId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as Trainer
      }

      return null
    } catch (error) {
      logger.error("Error fetching trainer", { trainerId, error })
      throw error
    }
  }

  static async updateTrainerStatus(trainerId: string, status: "temp" | "active"): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, trainerId)
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer status updated", { trainerId, status })
      return true
    } catch (error) {
      logger.error("Error updating trainer status", { trainerId, status, error })
      return false
    }
  }

  static async updateTrainerContent(trainerId: string, content: TrainerContent): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, trainerId)
      await updateDoc(docRef, {
        content: {
          ...content,
          lastModified: new Date().toISOString(),
          version: (content.version || 1) + 1,
        },
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer content updated", { trainerId })
      return true
    } catch (error) {
      logger.error("Error updating trainer content", { trainerId, error })
      return false
    }
  }

  static async getTrainerByTempId(tempId: string): Promise<Trainer | null> {
    try {
      const q = query(collection(db, this.COLLECTION), where("tempId", "==", tempId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        } as Trainer
      }

      return null
    } catch (error) {
      logger.error("Error fetching trainer by temp ID", { tempId, error })
      throw error
    }
  }

  static generateDefaultContent(trainer: Partial<Trainer>): TrainerContent {
    return {
      heroTitle: `Transform Your Fitness with ${trainer.name}`,
      heroSubtitle: `Professional ${trainer.specialization} trainer with ${trainer.experience} years of experience in ${trainer.location}`,
      aboutTitle: "About Me",
      aboutContent:
        trainer.bio ||
        `I'm ${trainer.name}, a dedicated ${trainer.specialization} trainer with ${trainer.experience} years of experience helping clients achieve their fitness goals. Based in ${trainer.location}, I specialize in creating personalized training programs that deliver real results.`,
      services: this.generateDefaultServices(trainer),
      contactTitle: "Get in Touch",
      contactDescription:
        "Ready to start your fitness journey? Contact me to schedule your first session and take the first step towards achieving your fitness goals.",
      seoTitle: `${trainer.name} - ${trainer.specialization} Trainer in ${trainer.location}`,
      seoDescription: `Professional ${trainer.specialization} training with ${trainer.name}. ${trainer.experience} years experience in ${trainer.location}. Book your session today!`,
      lastModified: new Date().toISOString(),
      version: 1,
    }
  }

  static generateDefaultServices(trainer: Partial<Trainer>): Service[] {
    const baseServices = [
      {
        id: "service_1",
        title: "Personal Training Session",
        description:
          "One-on-one personalized training session tailored to your fitness goals and current fitness level.",
        price: 60,
        duration: "60 minutes",
        category: "training",
      },
      {
        id: "service_2",
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation including body composition analysis and goal setting.",
        price: 40,
        duration: "45 minutes",
        category: "assessment",
      },
      {
        id: "service_3",
        title: "Custom Workout Plan",
        description: "Personalized workout program designed specifically for your goals and schedule.",
        price: 80,
        duration: "Digital delivery",
        category: "program",
      },
    ]

    // Customize based on specialization
    if (trainer.specialization?.toLowerCase().includes("nutrition")) {
      baseServices.push({
        id: "service_4",
        title: "Nutrition Consultation",
        description: "Personalized nutrition guidance and meal planning to support your fitness goals.",
        price: 50,
        duration: "45 minutes",
        category: "nutrition",
      })
    }

    return baseServices
  }
}
