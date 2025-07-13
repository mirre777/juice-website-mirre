import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase"
import type { Trainer, TrainerContent, Service } from "@/types/trainer"
import { logger } from "@/lib/logger"

export class TrainerService {
  private readonly collection = "trainers"

  async getTrainer(id: string): Promise<Trainer | null> {
    try {
      const docRef = doc(db, this.collection, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return { id: docSnap.id, ...data } as Trainer
      }

      return null
    } catch (error) {
      logger.error("Error getting trainer", { error, id })
      throw error
    }
  }

  async updateTrainerContent(id: string, content: TrainerContent): Promise<boolean> {
    try {
      const docRef = doc(db, this.collection, id)

      await updateDoc(docRef, {
        content,
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer content updated", { id, version: content.version })
      return true
    } catch (error) {
      logger.error("Error updating trainer content", { error, id })
      return false
    }
  }

  async generateDefaultContent(trainer: Trainer): Promise<TrainerContent> {
    const defaultServices: Service[] = [
      {
        id: "service_1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session tailored to your goals",
        price: 60,
        duration: "60 minutes",
      },
      {
        id: "service_2",
        title: "Group Training Session",
        description: "Small group training session for 2-4 people",
        price: 40,
        duration: "45 minutes",
      },
    ]

    const content: TrainerContent = {
      heroTitle: `${trainer.firstName} ${trainer.lastName}`,
      heroSubtitle: `Professional ${trainer.specialization} Trainer in ${trainer.location}`,
      aboutTitle: "About Me",
      aboutContent: `Hi, I'm ${trainer.firstName}! I'm a certified ${trainer.specialization} trainer with ${trainer.experience} of experience. I'm passionate about helping people achieve their fitness goals through personalized training programs.

My approach focuses on creating sustainable habits and building confidence in the gym. Whether you're just starting your fitness journey or looking to break through plateaus, I'm here to guide and support you every step of the way.`,
      services: defaultServices,
      contactTitle: "Get In Touch",
      contactContent: `Ready to start your fitness journey? Contact me to schedule your first session! I offer flexible scheduling and personalized programs designed just for you.

Let's work together to achieve your fitness goals!`,
      seoTitle: `${trainer.firstName} ${trainer.lastName} - ${trainer.specialization} Trainer in ${trainer.location}`,
      seoDescription: `Professional ${trainer.specialization} trainer in ${trainer.location}. ${trainer.experience} of experience. Personalized training programs to help you achieve your fitness goals.`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    logger.info("Generated default content for trainer", { trainerId: trainer.id })
    return content
  }

  async createTrainer(trainerData: Omit<Trainer, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, this.collection))
      const trainer: Trainer = {
        id: docRef.id,
        ...trainerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await setDoc(docRef, trainer)
      logger.info("Trainer created", { id: docRef.id })
      return docRef.id
    } catch (error) {
      logger.error("Error creating trainer", { error })
      throw error
    }
  }

  async updateTrainerStatus(id: string, status: "temp" | "active"): Promise<boolean> {
    try {
      const docRef = doc(db, this.collection, id)
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      })

      logger.info("Trainer status updated", { id, status })
      return true
    } catch (error) {
      logger.error("Error updating trainer status", { error, id })
      return false
    }
  }

  async getTrainerByTempId(tempId: string): Promise<Trainer | null> {
    try {
      const q = query(collection(db, this.collection), where("tempId", "==", tempId))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return { id: doc.id, ...doc.data() } as Trainer
      }

      return null
    } catch (error) {
      logger.error("Error getting trainer by temp ID", { error, tempId })
      throw error
    }
  }
}
