/**
 * CRITICAL: Read docs/FIREBASE_BUILD_ISSUES.md before modifying this file!
 * This file contains Firebase Admin SDK usage that MUST be properly guarded against build-time initialization.
 */

import type { TrainerFormData, TrainerContent } from "@/types/trainer"

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

if (isBuildTime) {
  console.log("Build time detected - completely skipping Firebase initialization in firebase-trainer")
}

let db: any = null

async function getFirebaseDb() {
  if (isBuildTime) {
    throw new Error("Firebase not available during build time")
  }

  if (!db) {
    try {
      const { initializeApp, getApps, cert } = await import("firebase-admin/app")
      const { getFirestore } = await import("firebase-admin/firestore")

      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        })
      }
      db = getFirestore()
    } catch (error) {
      console.error("Firebase Admin initialization error:", error)
      throw error
    }
  }
  return db
}

export class TrainerService {
  static async createTempTrainer(trainerData: Partial<TrainerFormData>): Promise<string> {
    if (isBuildTime) {
      throw new Error("TrainerService not available during build time")
    }

    try {
      console.log("Creating temp trainer with data:", trainerData)

      // Generate temp ID
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create expiration time (24 hours from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Generate default content with new field structure
      const defaultContent: TrainerContent = {
        hero: {
          title: `Transform Your Fitness with ${trainerData.fullName}`,
          subtitle: `Professional ${trainerData.specialty} trainer in ${trainerData.city}, ${trainerData.district}`,
          description:
            trainerData.bio ||
            "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
        },
        about: {
          title: `About ${trainerData.fullName}`,
          content:
            trainerData.bio ||
            "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
        },
        services: trainerData.services?.map((service: string, index: number) => ({
          id: String(index + 1),
          title: service,
          description: `Professional ${service.toLowerCase()} sessions tailored to your goals`,
          price: 60,
          duration: "60 minutes",
          featured: index === 0,
        })) || [
          {
            id: "1",
            title: "Personal Training",
            description: "Personalized training sessions tailored to your goals",
            price: 60,
            duration: "60 minutes",
            featured: true,
          },
        ],
        contact: {
          title: "Let's Start Your Fitness Journey",
          description:
            "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
          email: trainerData.email || "",
          phone: trainerData.phone || "",
          city: trainerData.city || "",
          district: trainerData.district || "",
        },
        seo: {
          title: `${trainerData.fullName} - Personal Trainer in ${trainerData.city}, ${trainerData.district}`,
          description: `Professional ${trainerData.specialty} training with ${trainerData.fullName}. Transform your fitness with personalized programs in ${trainerData.city}, ${trainerData.district}.`,
        },
      }

      // Create trainer document with new structure
      const trainerDoc = {
        id: tempId,
        fullName: trainerData.fullName,
        email: trainerData.email,
        phone: trainerData.phone || "",
        city: trainerData.city,
        district: trainerData.district,
        specialty: trainerData.specialty,
        certifications: trainerData.certifications || "",
        bio: trainerData.bio || "",
        services: trainerData.services || [],
        status: "temp",
        isPaid: false,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        content: defaultContent,
        customization: {
          lastUpdated: new Date().toISOString(),
          version: 1,
          isDraft: false,
        },
      }

      const firebaseDb = await getFirebaseDb()
      await firebaseDb.collection("trainers").doc(tempId).set(trainerDoc)

      console.log("Temp trainer created successfully:", tempId)
      return tempId
    } catch (error) {
      console.error("Error creating temp trainer:", error)
      throw new Error("Failed to create temp trainer")
    }
  }

  static async getTempTrainer(tempId: string) {
    if (isBuildTime) {
      throw new Error("TrainerService not available during build time")
    }

    try {
      const firebaseDb = await getFirebaseDb()
      const doc = await firebaseDb.collection("trainers").doc(tempId).get()

      if (!doc.exists) {
        throw new Error("Trainer not found")
      }

      const data = doc.data()

      // Check if expired
      if (data?.expiresAt && new Date(data.expiresAt) < new Date()) {
        throw new Error("Trainer session expired")
      }

      return { id: doc.id, ...data }
    } catch (error) {
      console.error("Error getting temp trainer:", error)
      throw error
    }
  }

  static async activateTrainer(tempId: string, paymentIntentId: string): Promise<string> {
    if (isBuildTime) {
      throw new Error("TrainerService not available during build time")
    }

    try {
      const tempTrainer = await this.getTempTrainer(tempId)

      // Generate permanent ID
      const permanentId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Update trainer data for activation
      const activatedTrainer = {
        ...tempTrainer,
        id: permanentId,
        status: "active",
        isPaid: true,
        isActive: true,
        activatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentIntentId,
        // Remove temp-specific fields
        expiresAt: null,
      }

      const firebaseDb = await getFirebaseDb()

      // Save activated trainer
      await firebaseDb.collection("trainers").doc(permanentId).set(activatedTrainer)

      // Delete temp trainer
      await firebaseDb.collection("trainers").doc(tempId).delete()

      console.log("Trainer activated successfully:", permanentId)
      return permanentId
    } catch (error) {
      console.error("Error activating trainer:", error)
      throw new Error("Failed to activate trainer")
    }
  }
}
