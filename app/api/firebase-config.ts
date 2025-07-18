import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    const requiredEnvVars = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }

    // Check if all required environment variables are present
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      console.error("Missing Firebase environment variables:", missingVars)
      throw new Error(`Missing Firebase environment variables: ${missingVars.join(", ")}`)
    }

    initializeApp({
      credential: cert({
        projectId: requiredEnvVars.projectId,
        clientEmail: requiredEnvVars.clientEmail,
        privateKey: requiredEnvVars.privateKey?.replace(/\\n/g, "\n"),
      }),
    })

    console.log("Firebase Admin SDK initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
    throw error
  }
}

// Export the Firestore database instance
export const db = getFirestore()

// Export Firebase app for other uses
export const app = getApps()[0]
