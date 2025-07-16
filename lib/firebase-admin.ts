import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }

    initializeApp({
      credential: cert(serviceAccount),
    })
  }
}

// Get Firestore instance
export function getFirebaseAdminDb() {
  initializeFirebaseAdmin()
  return getFirestore()
}

// Helper function to get trainer data
export async function getTrainerById(trainerId: string) {
  const db = getFirebaseAdminDb()
  const doc = await db.collection("trainers").doc(trainerId).get()

  if (!doc.exists) {
    return null
  }

  return {
    id: doc.id,
    ...doc.data(),
  }
}

// Helper function to update trainer data
export async function updateTrainer(trainerId: string, data: any) {
  const db = getFirebaseAdminDb()
  await db.collection("trainers").doc(trainerId).update(data)
}

// Helper function to activate trainer
export async function activateTrainer(trainerId: string) {
  const db = getFirebaseAdminDb()
  await db.collection("trainers").doc(trainerId).update({
    status: "active",
    isActive: true,
    activatedAt: new Date().toISOString(),
  })
}
