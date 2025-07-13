import { db } from "@/app/api/firebase-config"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"
import type { Trainer, TrainerFormData, TrainerContent } from "@/types/trainer"

export async function createTrainer(
  formData: TrainerFormData,
): Promise<{ success: boolean; trainerId?: string; tempId?: string; error?: string }> {
  try {
    if (!db) {
      // Mock mode - return success with mock IDs
      const mockTempId = `temp_${Date.now()}`
      logger.info("Creating trainer in mock mode", { formData, mockTempId })
      return { success: true, tempId: mockTempId }
    }

    // Generate a temporary ID
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const trainerData: Trainer = {
      id: tempId,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: generateDefaultContent(formData),
    }

    await setDoc(doc(db, "trainers", tempId), trainerData)

    logger.info("Trainer created successfully", { tempId, trainerData })
    return { success: true, tempId }
  } catch (error) {
    logger.error("Error creating trainer", {
      error: error instanceof Error ? error.message : "Unknown error",
      formData,
    })
    return { success: false, error: "Failed to create trainer profile" }
  }
}

export async function getTrainer(id: string): Promise<Trainer | null> {
  try {
    if (!db) {
      // Mock mode - return mock trainer data
      logger.info("Getting trainer in mock mode", { id })
      return {
        id,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        specialization: "Personal Training",
        experience: "5+ years",
        location: "New York, NY",
        bio: "Experienced personal trainer passionate about helping clients achieve their fitness goals.",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: {
          heroTitle: "John Doe - Personal Trainer",
          heroSubtitle: "Transform Your Body, Transform Your Life",
          aboutTitle: "About Me",
          aboutContent:
            "With over 5 years of experience in personal training, I specialize in helping clients achieve their fitness goals through personalized workout programs and nutritional guidance.",
          services: [
            {
              id: "1",
              title: "Personal Training Session",
              description: "One-on-one personalized training session tailored to your goals",
              price: 75,
              duration: "60 minutes",
            },
            {
              id: "2",
              title: "Fitness Assessment",
              description: "Comprehensive fitness evaluation and goal setting session",
              price: 50,
              duration: "45 minutes",
            },
          ],
          contactTitle: "Ready to Start Your Journey?",
          contactMessage: "Contact me today to schedule your first session and begin your transformation!",
          seoTitle: "John Doe - Personal Trainer in New York",
          seoDescription:
            "Professional personal trainer in New York with 5+ years experience. Specialized fitness programs tailored to your goals.",
          version: 1,
          lastModified: new Date().toISOString(),
        },
      }
    }

    const docRef = doc(db, "trainers", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const trainer = { id: docSnap.id, ...docSnap.data() } as Trainer
      logger.info("Trainer retrieved successfully", { id, trainer })
      return trainer
    } else {
      logger.warn("Trainer not found", { id })
      return null
    }
  } catch (error) {
    logger.error("Error getting trainer", { error: error instanceof Error ? error.message : "Unknown error", id })
    return null
  }
}

export async function updateTrainerContent(id: string, content: TrainerContent): Promise<Trainer | null> {
  try {
    if (!db) {
      // Mock mode - return updated mock data
      logger.info("Updating trainer content in mock mode", { id, content })
      const mockTrainer = await getTrainer(id)
      if (mockTrainer) {
        return {
          ...mockTrainer,
          content: {
            ...content,
            version: (mockTrainer.content?.version || 0) + 1,
            lastModified: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        }
      }
      return null
    }

    const docRef = doc(db, "trainers", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      logger.warn("Trainer not found for content update", { id })
      return null
    }

    const updatedContent = {
      ...content,
      version: (docSnap.data().content?.version || 0) + 1,
      lastModified: new Date().toISOString(),
    }

    await updateDoc(docRef, {
      content: updatedContent,
      updatedAt: new Date().toISOString(),
    })

    const updatedTrainer = await getTrainer(id)
    logger.info("Trainer content updated successfully", { id, updatedContent })
    return updatedTrainer
  } catch (error) {
    logger.error("Error updating trainer content", {
      error: error instanceof Error ? error.message : "Unknown error",
      id,
      content,
    })
    return null
  }
}

export async function activateTrainer(
  tempId: string,
  paymentIntentId: string,
): Promise<{ success: boolean; trainerId?: string; error?: string }> {
  try {
    if (!db) {
      // Mock mode
      const mockTrainerId = `trainer_${Date.now()}`
      logger.info("Activating trainer in mock mode", { tempId, paymentIntentId, mockTrainerId })
      return { success: true, trainerId: mockTrainerId }
    }

    // Get the temporary trainer
    const tempTrainer = await getTrainer(tempId)
    if (!tempTrainer) {
      return { success: false, error: "Temporary trainer not found" }
    }

    // Generate permanent ID
    const trainerId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create activated trainer
    const activatedTrainer: Trainer = {
      ...tempTrainer,
      id: trainerId,
      status: "active",
      paymentIntentId,
      activatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "trainers", trainerId), activatedTrainer)

    logger.info("Trainer activated successfully", { tempId, trainerId, paymentIntentId })
    return { success: true, trainerId }
  } catch (error) {
    logger.error("Error activating trainer", {
      error: error instanceof Error ? error.message : "Unknown error",
      tempId,
      paymentIntentId,
    })
    return { success: false, error: "Failed to activate trainer" }
  }
}

export function generateDefaultContent(formData: TrainerFormData): TrainerContent {
  return {
    heroTitle: `${formData.firstName} ${formData.lastName}`,
    heroSubtitle: `Professional ${formData.specialization} Trainer`,
    aboutTitle: "About Me",
    aboutContent: `Welcome! I'm ${formData.firstName}, a dedicated ${formData.specialization.toLowerCase()} trainer with ${formData.experience} of experience. Based in ${formData.location}, I'm passionate about helping clients achieve their fitness goals through personalized training programs.\n\n${formData.bio}`,
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session tailored to your specific goals and fitness level.",
        price: 75,
        duration: "60 minutes",
      },
      {
        id: "2",
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation including goal setting and program design.",
        price: 50,
        duration: "45 minutes",
      },
    ],
    contactTitle: "Ready to Start Your Journey?",
    contactMessage: `Ready to transform your fitness? Contact me today to schedule your first session and begin your journey to a healthier, stronger you!`,
    seoTitle: `${formData.firstName} ${formData.lastName} - ${formData.specialization} Trainer in ${formData.location}`,
    seoDescription: `Professional ${formData.specialization.toLowerCase()} trainer in ${formData.location} with ${formData.experience} experience. Personalized fitness programs tailored to your goals.`,
    version: 1,
    lastModified: new Date().toISOString(),
  }
}
