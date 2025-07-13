import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase"
import { logger } from "@/lib/logger"
import type { Trainer, TrainerContent } from "@/types/trainer"

const TRAINERS_COLLECTION = "trainers"

export async function getTrainer(id: string): Promise<Trainer | null> {
  try {
    const docRef = doc(db, TRAINERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Trainer
    }

    return null
  } catch (error) {
    logger.error("Error getting trainer", { error, trainerId: id })
    throw error
  }
}

export async function updateTrainerContent(id: string, content: TrainerContent): Promise<Trainer | null> {
  try {
    const docRef = doc(db, TRAINERS_COLLECTION, id)

    // Check if trainer exists
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return null
    }

    // Update with version control
    const updateData = {
      content: {
        ...content,
        lastModified: serverTimestamp(),
        version: (docSnap.data().content?.version || 0) + 1,
      },
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)

    // Return updated trainer
    const updatedDoc = await getDoc(docRef)
    return { id: updatedDoc.id, ...updatedDoc.data() } as Trainer
  } catch (error) {
    logger.error("Error updating trainer content", { error, trainerId: id })
    throw error
  }
}

export function generateDefaultContent(trainer: Trainer): TrainerContent {
  const services = [
    {
      id: "1",
      title: "Personal Training Session",
      description: "One-on-one personalized training session tailored to your fitness goals.",
      price: "€60",
      duration: "60 minutes",
    },
    {
      id: "2",
      title: "Fitness Assessment",
      description: "Comprehensive fitness evaluation and goal-setting session.",
      price: "€40",
      duration: "45 minutes",
    },
  ]

  return {
    heroTitle: `${trainer.firstName} ${trainer.lastName}`,
    heroSubtitle: `Professional ${trainer.specialization} Trainer with ${trainer.experience} years of experience`,
    aboutTitle: "About Me",
    aboutContent:
      trainer.bio ||
      `I'm a certified ${trainer.specialization.toLowerCase()} trainer passionate about helping clients achieve their fitness goals. With ${trainer.experience} years of experience, I provide personalized training programs that deliver real results.`,
    services,
    contactTitle: "Get in Touch",
    contactContent:
      "Ready to start your fitness journey? Contact me today to schedule your first session and take the first step towards achieving your goals!",
    seoTitle: `${trainer.firstName} ${trainer.lastName} - ${trainer.specialization} Trainer in ${trainer.location}`,
    seoDescription: `Professional ${trainer.specialization.toLowerCase()} trainer in ${trainer.location}. ${trainer.experience} years experience. Book your personalized training session today!`,
    version: 1,
    lastModified: new Date(),
  }
}

export async function createTrainer(trainerData: Omit<Trainer, "id">): Promise<string> {
  try {
    const docRef = doc(collection(db, TRAINERS_COLLECTION))
    const trainer: Trainer = {
      id: docRef.id,
      ...trainerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(docRef, trainer)
    logger.info("Trainer created successfully", { trainerId: docRef.id })

    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer", { error })
    throw error
  }
}

export async function getTrainerByTempId(tempId: string): Promise<Trainer | null> {
  try {
    const q = query(collection(db, TRAINERS_COLLECTION), where("tempId", "==", tempId))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Trainer
  } catch (error) {
    logger.error("Error getting trainer by temp ID", { error, tempId })
    throw error
  }
}

export async function activateTrainer(tempId: string, paymentIntentId: string): Promise<Trainer | null> {
  try {
    const trainer = await getTrainerByTempId(tempId)
    if (!trainer) {
      return null
    }

    const docRef = doc(db, TRAINERS_COLLECTION, trainer.id)
    const updateData = {
      status: "active",
      paymentIntentId,
      activatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
    logger.info("Trainer activated successfully", { trainerId: trainer.id, tempId })

    return { ...trainer, ...updateData }
  } catch (error) {
    logger.error("Error activating trainer", { error, tempId })
    throw error
  }
}
