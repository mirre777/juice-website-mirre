import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
import { logger } from "./logger"

export interface TrainerContent {
  heroTitle?: string
  heroSubtitle?: string
  aboutTitle?: string
  aboutDescription?: string
  services?: Array<{
    id: string
    title: string
    description: string
    price: string
    duration: string
  }>
  contactEmail?: string
  contactPhone?: string
  contactLocation?: string
  seoTitle?: string
  seoDescription?: string
  lastModified?: string
  version?: number
}

export interface Trainer {
  id: string
  name: string
  email: string
  phone?: string
  specialization: string
  experience: string
  location?: string
  bio?: string
  certifications?: string[]
  status: "temp" | "active" | "inactive"
  content?: TrainerContent
  createdAt: string
  activatedAt?: string
  tempId?: string
  stripePaymentIntentId?: string
}

export class TrainerService {
  private static readonly COLLECTION_NAME = "trainers"

  static async createTrainer(trainerData: Omit<Trainer, "id" | "createdAt">): Promise<string> {
    logger.info("Creating new trainer", { email: trainerData.email })

    if (!hasRealFirebaseConfig || !db) {
      logger.info("Using mock mode for trainer creation")
      const mockId = `trainer_${Date.now()}`
      return mockId
    }

    try {
      const trainerId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const trainer: Trainer = {
        ...trainerData,
        id: trainerId,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, this.COLLECTION_NAME, trainerId), {
        ...trainer,
        createdAt: serverTimestamp(),
      })

      logger.info("Trainer created successfully", { trainerId, email: trainerData.email })
      return trainerId
    } catch (error) {
      logger.error("Error creating trainer", {
        error: error instanceof Error ? error.message : String(error),
        email: trainerData.email,
      })
      throw error
    }
  }

  static async getTrainer(trainerId: string): Promise<Trainer | null> {
    logger.info("Fetching trainer", { trainerId })

    if (!hasRealFirebaseConfig || !db) {
      logger.info("Using mock mode for trainer fetch")
      return this.getMockTrainer(trainerId)
    }

    try {
      const docRef = doc(db, this.COLLECTION_NAME, trainerId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const trainer: Trainer = {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          activatedAt: data.activatedAt?.toDate?.()?.toISOString() || data.activatedAt,
        } as Trainer

        logger.info("Trainer fetched successfully", { trainerId })
        return trainer
      } else {
        logger.warn("Trainer not found", { trainerId })
        return null
      }
    } catch (error) {
      logger.error("Error fetching trainer", {
        trainerId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  static async updateTrainerContent(trainerId: string, content: TrainerContent): Promise<Trainer | null> {
    logger.info("Updating trainer content", { trainerId, contentKeys: Object.keys(content) })

    if (!hasRealFirebaseConfig || !db) {
      logger.info("Using mock mode for content update")
      const mockTrainer = this.getMockTrainer(trainerId)
      if (mockTrainer) {
        mockTrainer.content = {
          ...content,
          lastModified: new Date().toISOString(),
          version: (mockTrainer.content?.version || 0) + 1,
        }
        return mockTrainer
      }
      return null
    }

    try {
      const docRef = doc(db, this.COLLECTION_NAME, trainerId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        logger.warn("Trainer not found for content update", { trainerId })
        return null
      }

      const updatedContent: TrainerContent = {
        ...content,
        lastModified: new Date().toISOString(),
        version: (docSnap.data().content?.version || 0) + 1,
      }

      await updateDoc(docRef, {
        content: updatedContent,
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer content updated successfully", { trainerId })
      return await this.getTrainer(trainerId)
    } catch (error) {
      logger.error("Error updating trainer content", {
        trainerId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  static async activateTrainer(tempId: string, paymentIntentId: string): Promise<string> {
    logger.info("Activating trainer", { tempId, paymentIntentId })

    if (!hasRealFirebaseConfig || !db) {
      logger.info("Using mock mode for trainer activation")
      return `trainer_${Date.now()}`
    }

    try {
      // Find temp trainer
      const tempQuery = query(
        collection(db, this.COLLECTION_NAME),
        where("tempId", "==", tempId),
        where("status", "==", "temp"),
      )
      const tempDocs = await getDocs(tempQuery)

      if (tempDocs.empty) {
        throw new Error("Temp trainer not found")
      }

      const tempDoc = tempDocs.docs[0]
      const tempData = tempDoc.data()

      // Update to active status
      await updateDoc(tempDoc.ref, {
        status: "active",
        stripePaymentIntentId: paymentIntentId,
        activatedAt: serverTimestamp(),
        content: this.generateDefaultContent(tempData),
      })

      logger.info("Trainer activated successfully", {
        trainerId: tempDoc.id,
        tempId,
        paymentIntentId,
      })
      return tempDoc.id
    } catch (error) {
      logger.error("Error activating trainer", {
        tempId,
        paymentIntentId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  static async getTempTrainer(tempId: string): Promise<Trainer | null> {
    logger.info("Fetching temp trainer", { tempId })

    if (!hasRealFirebaseConfig || !db) {
      logger.info("Using mock mode for temp trainer fetch")
      return this.getMockTrainer(tempId)
    }

    try {
      const tempQuery = query(
        collection(db, this.COLLECTION_NAME),
        where("tempId", "==", tempId),
        where("status", "==", "temp"),
      )
      const tempDocs = await getDocs(tempQuery)

      if (!tempDocs.empty) {
        const doc = tempDocs.docs[0]
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        } as Trainer
      }

      logger.warn("Temp trainer not found", { tempId })
      return null
    } catch (error) {
      logger.error("Error fetching temp trainer", {
        tempId,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  static generateDefaultContent(trainerData: any): TrainerContent {
    return {
      heroTitle: `Transform Your Fitness with ${trainerData.name}`,
      heroSubtitle: `Professional ${trainerData.specialization} training tailored to your goals`,
      aboutTitle: "About Me",
      aboutDescription: `Hi, I'm ${trainerData.name}, a certified ${trainerData.specialization} trainer with ${trainerData.experience} years of experience. I'm passionate about helping clients achieve their fitness goals through personalized training programs.`,
      services: [
        {
          id: "1",
          title: "Personal Training",
          description: "One-on-one training sessions tailored to your specific goals",
          price: "€60",
          duration: "60 min",
        },
        {
          id: "2",
          title: "Group Training",
          description: "Small group sessions for motivation and community",
          price: "€30",
          duration: "45 min",
        },
      ],
      contactEmail: trainerData.email,
      contactPhone: trainerData.phone || "",
      contactLocation: trainerData.location || "",
      seoTitle: `${trainerData.name} - Professional ${trainerData.specialization} Trainer`,
      seoDescription: `Book personal training sessions with ${trainerData.name}, a certified ${trainerData.specialization} trainer. Transform your fitness journey today.`,
      lastModified: new Date().toISOString(),
      version: 1,
    }
  }

  private static getMockTrainer(id: string): Trainer {
    return {
      id,
      name: "John Doe",
      email: "john@example.com",
      phone: "+31 6 12345678",
      specialization: "Strength Training",
      experience: "5",
      location: "Amsterdam, Netherlands",
      bio: "Passionate fitness trainer with 5 years of experience helping clients achieve their goals.",
      certifications: ["NASM-CPT", "Nutrition Specialist"],
      status: "active",
      createdAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      content: {
        heroTitle: "Transform Your Fitness with John Doe",
        heroSubtitle: "Professional Strength Training tailored to your goals",
        aboutTitle: "About Me",
        aboutDescription: "Hi, I'm John Doe, a certified Strength Training trainer with 5 years of experience.",
        services: [
          {
            id: "1",
            title: "Personal Training",
            description: "One-on-one training sessions tailored to your specific goals",
            price: "€60",
            duration: "60 min",
          },
        ],
        contactEmail: "john@example.com",
        contactPhone: "+31 6 12345678",
        contactLocation: "Amsterdam, Netherlands",
        seoTitle: "John Doe - Professional Strength Training Trainer",
        seoDescription: "Book personal training sessions with John Doe, a certified Strength Training trainer.",
        lastModified: new Date().toISOString(),
        version: 1,
      },
    }
  }
}
