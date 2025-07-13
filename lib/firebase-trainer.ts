import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc, query, where, limit } from "firebase/firestore"
import { logger } from "./logger"

export interface TrainerData {
  id?: string
  name: string
  email: string
  phone?: string
  specialization: string
  experience: string
  location?: string
  bio?: string
  certifications?: string[]
  status: "temp" | "active" | "inactive"
  createdAt: string
  tempId?: string
  paymentIntentId?: string
}

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

export class TrainerService {
  static async createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt">): Promise<string> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        const mockId = `trainer_${Date.now()}`
        logger.info("Mock: Created trainer", { trainerId: mockId })
        return mockId
      }

      const trainersRef = collection(db, "trainers")
      const docRef = await addDoc(trainersRef, {
        ...trainerData,
        createdAt: new Date().toISOString(),
      })

      logger.info("Trainer created successfully", { trainerId: docRef.id })
      return docRef.id
    } catch (error) {
      logger.error("Error creating trainer", { error })
      throw new Error("Failed to create trainer")
    }
  }

  static async getTrainer(trainerId: string): Promise<TrainerData | null> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        return {
          id: trainerId,
          name: "John Doe",
          email: "john@example.com",
          specialization: "Strength Training",
          experience: "5 years",
          location: "New York, NY",
          phone: "+1 (555) 123-4567",
          status: "active",
          createdAt: new Date().toISOString(),
        }
      }

      const trainerRef = doc(db, "trainers", trainerId)
      const trainerSnap = await getDoc(trainerRef)

      if (!trainerSnap.exists()) {
        return null
      }

      return { id: trainerSnap.id, ...trainerSnap.data() } as TrainerData
    } catch (error) {
      logger.error("Error fetching trainer", { error, trainerId })
      throw new Error("Failed to fetch trainer")
    }
  }

  static async updateTrainer(trainerId: string, updates: Partial<TrainerData>): Promise<void> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        logger.info("Mock: Updated trainer", { trainerId, updates })
        return
      }

      const trainerRef = doc(db, "trainers", trainerId)
      await updateDoc(trainerRef, updates)

      logger.info("Trainer updated successfully", { trainerId })
    } catch (error) {
      logger.error("Error updating trainer", { error, trainerId })
      throw new Error("Failed to update trainer")
    }
  }

  static async getTrainerByTempId(tempId: string): Promise<TrainerData | null> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        return {
          id: `trainer_${tempId}`,
          name: "John Doe",
          email: "john@example.com",
          specialization: "Strength Training",
          experience: "5 years",
          status: "temp",
          tempId: tempId,
          createdAt: new Date().toISOString(),
        }
      }

      const trainersRef = collection(db, "trainers")
      const q = query(trainersRef, where("tempId", "==", tempId), limit(1))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as TrainerData
    } catch (error) {
      logger.error("Error fetching trainer by temp ID", { error, tempId })
      throw new Error("Failed to fetch trainer")
    }
  }

  static async activateTrainer(trainerId: string, paymentIntentId: string): Promise<void> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        logger.info("Mock: Activated trainer", { trainerId, paymentIntentId })
        return
      }

      const trainerRef = doc(db, "trainers", trainerId)
      await updateDoc(trainerRef, {
        status: "active",
        paymentIntentId: paymentIntentId,
        activatedAt: new Date().toISOString(),
      })

      logger.info("Trainer activated successfully", { trainerId })
    } catch (error) {
      logger.error("Error activating trainer", { error, trainerId })
      throw new Error("Failed to activate trainer")
    }
  }

  static async updateTrainerContent(trainerId: string, content: TrainerContent): Promise<void> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        logger.info("Mock: Updated trainer content", { trainerId })
        return
      }

      const contentRef = doc(db, "trainer_content", trainerId)
      const updatedContent = {
        ...content,
        lastModified: new Date().toISOString(),
        version: (content.version || 0) + 1,
      }

      await setDoc(contentRef, updatedContent, { merge: true })
      logger.info("Trainer content updated successfully", { trainerId })
    } catch (error) {
      logger.error("Error updating trainer content", { error, trainerId })
      throw new Error("Failed to update trainer content")
    }
  }

  static async getTrainerContent(trainerId: string): Promise<TrainerContent | null> {
    try {
      if (!hasRealFirebaseConfig || !db) {
        // Mock implementation
        return {
          heroTitle: "Transform Your Fitness Journey",
          heroSubtitle: "Professional training tailored to your goals",
          aboutTitle: "About Me",
          aboutDescription: "Professional fitness trainer with years of experience.",
          services: [
            {
              id: "1",
              title: "Personal Training",
              description: "One-on-one training sessions",
              price: "€60",
              duration: "60 min",
            },
          ],
          contactEmail: "trainer@example.com",
          version: 1,
        }
      }

      const contentRef = doc(db, "trainer_content", trainerId)
      const contentSnap = await getDoc(contentRef)

      if (!contentSnap.exists()) {
        return null
      }

      return contentSnap.data() as TrainerContent
    } catch (error) {
      logger.error("Error fetching trainer content", { error, trainerId })
      throw new Error("Failed to fetch trainer content")
    }
  }

  static generateDefaultContent(trainer: TrainerData): TrainerContent {
    return {
      heroTitle: `Transform Your Fitness with ${trainer.name}`,
      heroSubtitle: `Professional ${trainer.specialization} training tailored to your goals`,
      aboutTitle: "About Me",
      aboutDescription: `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping clients achieve their fitness goals through personalized training programs.`,
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
      contactEmail: trainer.email,
      contactPhone: trainer.phone || "",
      contactLocation: trainer.location || "",
      seoTitle: `${trainer.name} - Professional ${trainer.specialization} Trainer`,
      seoDescription: `Get fit with ${trainer.name}, a certified ${trainer.specialization} trainer. Personalized training programs to help you achieve your fitness goals.`,
      version: 1,
    }
  }
}
