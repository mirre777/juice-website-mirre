import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import type { TrainerData, TrainerContent } from "@/types/trainer"
import { logger } from "@/lib/logger"

export class TrainerService {
  private static readonly COLLECTION = "trainers"

  // Mock data for when Firebase is not configured
  private static mockTrainers: Map<string, TrainerData> = new Map()

  static async createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt" | "updatedAt">): Promise<TrainerData> {
    const trainerId = this.generateTrainerId()
    const now = new Date()

    const trainer: TrainerData = {
      ...trainerData,
      id: trainerId,
      createdAt: now,
      updatedAt: now,
    }

    if (hasRealFirebaseConfig && db) {
      try {
        const docRef = doc(db, this.COLLECTION, trainerId)
        await setDoc(docRef, {
          ...trainer,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        logger.info("Trainer created in Firestore", { trainerId })
      } catch (error) {
        logger.error("Failed to create trainer in Firestore", { trainerId, error })
        throw error
      }
    } else {
      // Mock mode
      this.mockTrainers.set(trainerId, trainer)
      logger.info("Trainer created in mock mode", { trainerId })
    }

    return trainer
  }

  static async getTrainer(trainerId: string): Promise<TrainerData | null> {
    if (hasRealFirebaseConfig && db) {
      try {
        const docRef = doc(db, this.COLLECTION, trainerId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as TrainerData
        }

        return null
      } catch (error) {
        logger.error("Failed to get trainer from Firestore", { trainerId, error })
        throw error
      }
    } else {
      // Mock mode
      return this.mockTrainers.get(trainerId) || null
    }
  }

  static async updateTrainer(trainerId: string, updates: Partial<TrainerData>): Promise<TrainerData> {
    if (hasRealFirebaseConfig && db) {
      try {
        const docRef = doc(db, this.COLLECTION, trainerId)
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        })

        const updatedTrainer = await this.getTrainer(trainerId)
        if (!updatedTrainer) {
          throw new Error("Trainer not found after update")
        }

        logger.info("Trainer updated in Firestore", { trainerId })
        return updatedTrainer
      } catch (error) {
        logger.error("Failed to update trainer in Firestore", { trainerId, error })
        throw error
      }
    } else {
      // Mock mode
      const existingTrainer = this.mockTrainers.get(trainerId)
      if (!existingTrainer) {
        throw new Error("Trainer not found")
      }

      const updatedTrainer = {
        ...existingTrainer,
        ...updates,
        updatedAt: new Date(),
      }

      this.mockTrainers.set(trainerId, updatedTrainer)
      logger.info("Trainer updated in mock mode", { trainerId })
      return updatedTrainer
    }
  }

  static async updateTrainerContent(trainerId: string, content: TrainerContent): Promise<TrainerData> {
    const contentWithMetadata = {
      ...content,
      version: (content.version || 0) + 1,
      lastModified: new Date(),
    }

    return this.updateTrainer(trainerId, { content: contentWithMetadata })
  }

  static async getTrainerByTempId(tempId: string): Promise<TrainerData | null> {
    if (hasRealFirebaseConfig && db) {
      try {
        const q = query(collection(db, this.COLLECTION), where("tempId", "==", tempId))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const data = doc.data()
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as TrainerData
        }

        return null
      } catch (error) {
        logger.error("Failed to get trainer by tempId from Firestore", { tempId, error })
        throw error
      }
    } else {
      // Mock mode
      for (const trainer of this.mockTrainers.values()) {
        if (trainer.tempId === tempId) {
          return trainer
        }
      }
      return null
    }
  }

  static async activateTrainer(trainerId: string, paymentIntentId: string): Promise<TrainerData> {
    const updates = {
      status: "active" as const,
      paymentIntentId,
      activatedAt: new Date(),
    }

    return this.updateTrainer(trainerId, updates)
  }

  static async getAllTrainers(): Promise<TrainerData[]> {
    if (hasRealFirebaseConfig && db) {
      try {
        const querySnapshot = await getDocs(collection(db, this.COLLECTION))
        const trainers: TrainerData[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          trainers.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as TrainerData)
        })

        return trainers
      } catch (error) {
        logger.error("Failed to get all trainers from Firestore", { error })
        throw error
      }
    } else {
      // Mock mode
      return Array.from(this.mockTrainers.values())
    }
  }

  static async getActiveTrainers(): Promise<TrainerData[]> {
    if (hasRealFirebaseConfig && db) {
      try {
        const q = query(collection(db, this.COLLECTION), where("status", "==", "active"))
        const querySnapshot = await getDocs(q)
        const trainers: TrainerData[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          trainers.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as TrainerData)
        })

        return trainers
      } catch (error) {
        logger.error("Failed to get active trainers from Firestore", { error })
        throw error
      }
    } else {
      // Mock mode
      return Array.from(this.mockTrainers.values()).filter((trainer) => trainer.status === "active")
    }
  }

  private static generateTrainerId(): string {
    return `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static generateDefaultContent(trainerData: TrainerData): TrainerContent {
    return {
      hero: {
        title: `Transform Your Fitness with ${trainerData.name}`,
        subtitle: `Professional ${trainerData.specialization} trainer dedicated to helping you achieve your fitness goals`,
        description: `Located in ${trainerData.location}, I bring ${trainerData.experience} of experience to help you reach your full potential.`,
      },
      about: {
        title: "About Me",
        content: `Hi, I'm ${trainerData.name}, a certified ${trainerData.specialization} trainer with ${trainerData.experience} of experience. I'm passionate about helping people transform their lives through fitness and nutrition.

My specialization in ${trainerData.specialization} allows me to provide expert guidance tailored to your specific needs and goals. Whether you're just starting your fitness journey or looking to break through plateaus, I'm here to support and motivate you every step of the way.

I believe that fitness should be enjoyable and sustainable. That's why I work closely with each client to develop programs that fit their lifestyle, preferences, and goals.`,
      },
      services: [
        {
          id: "1",
          title: "Personal Training Session",
          description: "One-on-one personalized training session tailored to your fitness goals.",
          price: "€75",
          duration: "60 minutes",
        },
        {
          id: "2",
          title: "Nutrition Consultation",
          description: "Comprehensive nutrition plan and dietary guidance for optimal results.",
          price: "€50",
          duration: "45 minutes",
        },
        {
          id: "3",
          title: "Fitness Assessment",
          description: "Complete fitness evaluation and goal-setting session.",
          price: "€40",
          duration: "30 minutes",
        },
      ],
      contact: {
        title: "Get Started Today",
        description: "Ready to begin your transformation? Contact me to schedule your first session.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        location: trainerData.location,
        availability: "Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 8:00 AM - 6:00 PM\nSunday: By appointment",
      },
      seo: {
        title: `${trainerData.name} - Professional ${trainerData.specialization} Trainer in ${trainerData.location}`,
        description: `Transform your fitness with ${trainerData.name}, a certified ${trainerData.specialization} trainer in ${trainerData.location}. ${trainerData.experience} of experience. Book your session today!`,
      },
      version: 1,
      lastModified: new Date(),
    }
  }
}
