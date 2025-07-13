import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import type { TrainerData, TrainerContent } from "@/types/trainer"
import { logger } from "./logger"

// Mock data for when Firebase is not available
const mockTrainers: Record<string, { data: TrainerData; content?: TrainerContent }> = {
  "temp-123": {
    data: {
      id: "temp-123",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      specialization: "Strength Training",
      experience: "5",
      location: "New York, NY",
      bio: "Passionate fitness trainer with 5 years of experience.",
      status: "active",
      createdAt: new Date(),
      tempId: "temp-123",
    },
  },
}

export async function createTrainer(trainerData: Omit<TrainerData, "id" | "createdAt">): Promise<string> {
  try {
    if (!hasRealFirebaseConfig || !db) {
      // Mock implementation
      const id = `temp-${Date.now()}`
      mockTrainers[id] = {
        data: {
          ...trainerData,
          id,
          createdAt: new Date(),
        },
      }
      logger.info("Created mock trainer", { id })
      return id
    }

    const trainersRef = collection(db, "trainers")
    const docRef = doc(trainersRef)

    const trainer: TrainerData = {
      ...trainerData,
      id: docRef.id,
      createdAt: new Date(),
    }

    await setDoc(docRef, {
      ...trainer,
      createdAt: serverTimestamp(),
    })

    logger.info("Created trainer in Firestore", { id: docRef.id })
    return docRef.id
  } catch (error) {
    logger.error("Error creating trainer", { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function getTrainer(id: string): Promise<{ data: TrainerData; content?: TrainerContent } | null> {
  try {
    if (!hasRealFirebaseConfig || !db) {
      // Mock implementation
      const trainer = mockTrainers[id]
      if (trainer) {
        logger.info("Retrieved mock trainer", { id })
        return trainer
      }
      logger.warn("Mock trainer not found", { id })
      return null
    }

    const docRef = doc(db, "trainers", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      logger.warn("Trainer not found in Firestore", { id })
      return null
    }

    const data = docSnap.data() as TrainerData

    // Try to get content
    const contentRef = doc(db, "trainer_content", id)
    const contentSnap = await getDoc(contentRef)
    const content = contentSnap.exists() ? (contentSnap.data() as TrainerContent) : undefined

    logger.info("Retrieved trainer from Firestore", { id })
    return { data, content }
  } catch (error) {
    logger.error("Error getting trainer", { id, error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function updateTrainerStatus(id: string, status: "temp" | "active"): Promise<boolean> {
  try {
    if (!hasRealFirebaseConfig || !db) {
      // Mock implementation
      if (mockTrainers[id]) {
        mockTrainers[id].data.status = status
        logger.info("Updated mock trainer status", { id, status })
        return true
      }
      return false
    }

    const docRef = doc(db, "trainers", id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    })

    logger.info("Updated trainer status in Firestore", { id, status })
    return true
  } catch (error) {
    logger.error("Error updating trainer status", {
      id,
      status,
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

export async function updateTrainerContent(id: string, content: TrainerContent): Promise<boolean> {
  try {
    if (!hasRealFirebaseConfig || !db) {
      // Mock implementation
      if (mockTrainers[id]) {
        mockTrainers[id].content = {
          ...content,
          updatedAt: new Date(),
          version: (mockTrainers[id].content?.version || 0) + 1,
        }
        logger.info("Updated mock trainer content", { id })
        return true
      }
      return false
    }

    const contentRef = doc(db, "trainer_content", id)
    const contentData = {
      ...content,
      trainerId: id,
      updatedAt: serverTimestamp(),
      version: Date.now(), // Simple versioning
    }

    await setDoc(contentRef, contentData, { merge: true })

    logger.info("Updated trainer content in Firestore", { id })
    return true
  } catch (error) {
    logger.error("Error updating trainer content", {
      id,
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  }
}

export async function getTrainerByTempId(
  tempId: string,
): Promise<{ data: TrainerData; content?: TrainerContent } | null> {
  try {
    if (!hasRealFirebaseConfig || !db) {
      // Mock implementation
      const trainer = Object.values(mockTrainers).find((t) => t.data.tempId === tempId)
      if (trainer) {
        logger.info("Retrieved mock trainer by tempId", { tempId })
        return trainer
      }
      return null
    }

    const q = query(collection(db, "trainers"), where("tempId", "==", tempId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      logger.warn("Trainer not found by tempId", { tempId })
      return null
    }

    const doc = querySnapshot.docs[0]
    const data = doc.data() as TrainerData

    // Try to get content
    const contentRef = doc(db, "trainer_content", doc.id)
    const contentSnap = await getDoc(contentRef)
    const content = contentSnap.exists() ? (contentSnap.data() as TrainerContent) : undefined

    logger.info("Retrieved trainer by tempId from Firestore", { tempId, id: doc.id })
    return { data, content }
  } catch (error) {
    logger.error("Error getting trainer by tempId", {
      tempId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
