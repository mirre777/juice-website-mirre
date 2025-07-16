import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK (server-side only)
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }

      console.log("[FIREBASE ADMIN] Initializing with project:", serviceAccount.projectId)

      initializeApp({
        credential: cert(serviceAccount),
      })

      console.log("[FIREBASE ADMIN] Initialized successfully")
    } catch (error) {
      console.error("[FIREBASE ADMIN] Initialization failed:", error)
      throw error
    }
  }
}

// Get Firestore instance
export function getFirebaseAdminDb() {
  initializeFirebaseAdmin()
  return getFirestore()
}

// Helper function to get trainer data from trainers collection
export async function getTrainerById(trainerId: string) {
  try {
    const db = getFirebaseAdminDb()
    const doc = await db.collection("trainers").doc(trainerId).get()

    if (!doc.exists) {
      console.log("[FIREBASE ADMIN] Trainer not found:", trainerId)
      return null
    }

    const data = doc.data()
    console.log("[FIREBASE ADMIN] Trainer found:", data?.fullName || data?.name)

    return {
      id: doc.id,
      ...data,
    }
  } catch (error) {
    console.error("[FIREBASE ADMIN] Error getting trainer:", error)
    throw error
  }
}

// Helper function to get temp trainer data from tempTrainers collection
export async function getTempTrainerById(tempId: string) {
  try {
    const db = getFirebaseAdminDb()
    const doc = await db.collection("tempTrainers").doc(tempId).get()

    if (!doc.exists) {
      console.log("[FIREBASE ADMIN] Temp trainer not found:", tempId)
      return null
    }

    const data = doc.data()
    console.log("[FIREBASE ADMIN] Temp trainer found:", data?.name)

    return {
      id: doc.id,
      ...data,
    }
  } catch (error) {
    console.error("[FIREBASE ADMIN] Error getting temp trainer:", error)
    throw error
  }
}

// Helper function to update trainer data
export async function updateTrainer(trainerId: string, data: any) {
  try {
    const db = getFirebaseAdminDb()
    await db
      .collection("trainers")
      .doc(trainerId)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      })
    console.log("[FIREBASE ADMIN] Trainer updated:", trainerId)
  } catch (error) {
    console.error("[FIREBASE ADMIN] Error updating trainer:", error)
    throw error
  }
}

// Helper function to activate trainer (move from temp to active)
export async function activateTrainer(tempId: string, paymentData: any) {
  try {
    const db = getFirebaseAdminDb()

    // Get temp trainer data
    const tempTrainer = await getTempTrainerById(tempId)
    if (!tempTrainer) {
      throw new Error(`Temp trainer not found: ${tempId}`)
    }

    // Generate final trainer ID
    const finalId = `trainer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Generate AI content for the trainer
    const aiContent = generateTrainerContent(tempTrainer)

    // Create final trainer document
    const finalTrainerData = {
      ...tempTrainer,
      id: finalId,
      content: aiContent,
      isActive: true,
      status: "active",
      activatedAt: new Date().toISOString(),
      paymentData: paymentData,
    }

    // Save to trainers collection
    await db.collection("trainers").doc(finalId).set(finalTrainerData)

    // Delete temp trainer
    await db.collection("tempTrainers").doc(tempId).delete()

    console.log("[FIREBASE ADMIN] Trainer activated successfully:", finalId)
    return { finalId, trainerData: finalTrainerData }
  } catch (error) {
    console.error("[FIREBASE ADMIN] Error activating trainer:", error)
    throw error
  }
}

// Generate AI content for trainer
function generateTrainerContent(trainerData: any) {
  const name = trainerData?.fullName || trainerData?.name || "Trainer"
  const specialty = trainerData?.specialty || trainerData?.specialization || "Personal Training"
  const experience = trainerData?.experience || "5+ years"
  const location = trainerData?.location || "Location"

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialty} in ${location}`,
      description: `With ${experience} of experience, I help clients achieve their fitness goals through personalized training programs and expert guidance.`,
    },
    about: {
      title: "About Me",
      content: `I'm ${name}, a certified ${specialty} based in ${location}. With ${experience} in the fitness industry, I specialize in creating customized workout plans that deliver real results. My approach combines proven training methods with personalized attention to help you reach your fitness goals safely and effectively.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one sessions tailored to your specific goals and fitness level",
        price: "€80",
      },
      {
        title: "Group Training",
        description: "Small group sessions for motivation and cost-effective training",
        price: "€35",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with custom workout plans and nutrition guidance",
        price: "€150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Working with this trainer has completely transformed my approach to fitness. The personalized programs really work!",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating. I've seen incredible results in just 3 months.",
        rating: 5,
      },
      {
        name: "Emma L.",
        text: "The best investment I've made in my health. Highly recommend to anyone serious about fitness.",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData?.email,
      phone: trainerData?.phone || "+31 6 1234 5678",
      location: trainerData?.location,
      availability: "Monday - Saturday, 6:00 AM - 8:00 PM",
    },
  }
}
