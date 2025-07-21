import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/app/api/firebase-config"
import type {
  TrainerFormData,
  TrainerDocument,
  EditableTrainerContent,
  TrainerProfile,
  TrainerContent,
} from "@/types/trainer"
import { logger } from "@/lib/logger"

export class TrainerService {
  private static readonly COLLECTION = "trainers"

  static async createTempTrainer(formData: TrainerFormData): Promise<string> {
    try {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const trainerDoc: Partial<TrainerDocument> = {
        ...formData,
        id: tempId,
        tempId,
        status: "temp",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, this.COLLECTION, tempId), {
        ...trainerDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      logger.info("Created temporary trainer", { tempId, email: formData.email })
      return tempId
    } catch (error) {
      logger.error("Error creating temporary trainer", {
        error: error instanceof Error ? error.message : "Unknown error",
        formData: { email: formData.email, fullName: formData.fullName },
      })
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<TrainerDocument | null> {
    try {
      const docRef = doc(db, this.COLLECTION, tempId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        logger.warn("Temporary trainer not found", { tempId })
        return null
      }

      const data = docSnap.data()
      const trainer: TrainerDocument = {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        activatedAt: data.activatedAt?.toDate(),
      } as TrainerDocument

      logger.info("Retrieved temporary trainer", { tempId, status: trainer.status })
      return trainer
    } catch (error) {
      logger.error("Error getting temporary trainer", {
        tempId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async activateTrainer(tempId: string, paymentIntentId: string): Promise<string> {
    try {
      const tempTrainer = await this.getTempTrainer(tempId)

      if (!tempTrainer) {
        throw new Error("Temporary trainer not found")
      }

      if (tempTrainer.status !== "temp") {
        throw new Error("Trainer already processed")
      }

      // Generate permanent ID
      const permanentId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Generate default content from form data
      const defaultContent = this.generateDefaultContent(tempTrainer)

      // Create activated trainer document
      const activatedTrainer: Partial<TrainerDocument> = {
        ...tempTrainer,
        id: permanentId,
        status: "active",
        paymentIntentId,
        activatedAt: new Date(),
        updatedAt: new Date(),
        content: defaultContent,
        customization: {
          lastUpdated: new Date(),
          version: 1,
          isDraft: false,
        },
        settings: {
          isPublished: true,
          seoTitle: `${tempTrainer.fullName} - Personal Trainer`,
          seoDescription: `Professional personal training services by ${tempTrainer.fullName}. ${tempTrainer.specialty} specialist with ${tempTrainer.experience} of experience.`,
        },
      }

      // Save activated trainer
      await setDoc(doc(db, this.COLLECTION, permanentId), {
        ...activatedTrainer,
        activatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        "customization.lastUpdated": serverTimestamp(),
      })

      // Update temp trainer status
      await updateDoc(doc(db, this.COLLECTION, tempId), {
        status: "pending_payment",
        paymentIntentId,
        updatedAt: serverTimestamp(),
      })

      logger.info("Successfully activated trainer", {
        tempId,
        permanentId,
        paymentIntentId,
        email: tempTrainer.email,
      })

      return permanentId
    } catch (error) {
      logger.error("Error activating trainer", {
        tempId,
        paymentIntentId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<TrainerDocument | null> {
    try {
      const docRef = doc(db, this.COLLECTION, trainerId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        logger.warn("Trainer not found", { trainerId })
        return null
      }

      const data = docSnap.data()
      const trainer: TrainerDocument = {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        activatedAt: data.activatedAt?.toDate(),
        customization: data.customization
          ? {
              ...data.customization,
              lastUpdated: data.customization.lastUpdated?.toDate() || new Date(),
            }
          : undefined,
      } as TrainerDocument

      logger.info("Retrieved trainer", { trainerId, status: trainer.status })
      return trainer
    } catch (error) {
      logger.error("Error getting trainer", {
        trainerId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async updateTrainerContent(trainerId: string, content: EditableTrainerContent): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION, trainerId)

      await updateDoc(docRef, {
        content,
        "customization.lastUpdated": serverTimestamp(),
        "customization.version": (await this.getTrainer(trainerId))?.customization?.version
          ? (await this.getTrainer(trainerId))!.customization!.version + 1
          : 1,
        updatedAt: serverTimestamp(),
      })

      logger.info("Updated trainer content", {
        trainerId,
        contentKeys: Object.keys(content),
      })

      return true
    } catch (error) {
      logger.error("Error updating trainer content", {
        trainerId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return false
    }
  }

  private static generateDefaultContent(trainer: Partial<TrainerProfile>): TrainerContent {
    return {
      hero: {
        title: `Transform Your Fitness with ${trainer.name}`,
        subtitle: `Professional ${trainer.specialization} training tailored to your goals`,
        description: `Welcome! I'm ${trainer.name}, a certified personal trainer specializing in ${trainer.specialization}. With ${trainer.experience} of experience, I'm here to help you achieve your fitness goals through personalized training programs.`,
      },
      about: {
        title: "About Me",
        content: `I'm ${trainer.name}, a passionate fitness professional with ${trainer.experience} of experience in ${trainer.specialization}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.\n\nMy approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.\n\nI'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`,
      },
      services: [
        {
          id: "1",
          title: "Personal Training Session",
          description: "One-on-one personalized training session focused on your specific goals",
          price: 60,
          duration: "60 minutes",
          featured: true,
        },
        {
          id: "2",
          title: "Fitness Assessment",
          description: "Comprehensive fitness evaluation and goal-setting session",
          price: 40,
          duration: "45 minutes",
          featured: false,
        },
        {
          id: "3",
          title: "Custom Workout Plan",
          description: "Personalized workout program designed for your goals and schedule",
          price: 80,
          duration: "Digital delivery",
          featured: false,
        },
      ],
      contact: {
        title: "Let's Start Your Fitness Journey",
        description:
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        email: trainer.email || "",
        phone: trainer.phone || "",
        location: trainer.location || "",
      },
      seo: {
        title: `${trainer.name} - Personal Trainer in ${trainer.location}`,
        description: `Professional ${trainer.specialization} training with ${trainer.name}. Transform your fitness with personalized programs in ${trainer.location}.`,
      },
      version: 1,
      lastModified: new Date().toISOString(),
    }
  }

  static async getAllActiveTrainers(): Promise<TrainerDocument[]> {
    try {
      const q = query(collection(db, this.COLLECTION), where("status", "==", "active"))

      const querySnapshot = await getDocs(q)
      const trainers: TrainerDocument[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        trainers.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          activatedAt: data.activatedAt?.toDate(),
        } as TrainerDocument)
      })

      logger.info("Retrieved active trainers", { count: trainers.length })
      return trainers
    } catch (error) {
      logger.error("Error getting active trainers", {
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async createTrainer(
    trainerData: Omit<TrainerProfile, "id" | "createdAt" | "updatedAt">,
  ): Promise<TrainerProfile> {
    try {
      const now = new Date().toISOString()
      const trainer: TrainerProfile = {
        ...trainerData,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now,
        status: "pending",
      }

      // In a real implementation, this would save to Firestore
      // For now, we'll simulate the operation
      logger.info("Creating trainer profile", {
        trainerId: trainer.id,
        name: trainer.name,
        email: trainer.email,
      })

      return trainer
    } catch (error) {
      logger.error("Error creating trainer", { error })
      throw new Error("Failed to create trainer profile")
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}
