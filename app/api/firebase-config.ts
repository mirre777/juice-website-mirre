import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Check if we have real Firebase configuration
export function hasRealFirebaseConfig(): boolean {
  const requiredVars = [
    process.env.FIREBASE_PROJECT_ID,
    process.env.FIREBASE_CLIENT_EMAIL,
    process.env.FIREBASE_PRIVATE_KEY,
  ]

  return requiredVars.every((variable) => variable && variable !== "your-value-here" && variable.trim().length > 0)
}

// Initialize Firebase Admin
let app
if (!getApps().length) {
  try {
    if (hasRealFirebaseConfig()) {
      // Use real Firebase configuration
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    } else {
      // Fallback for development/testing
      console.warn("Using fallback Firebase configuration - some features may not work")
      app = initializeApp({
        projectId: "demo-project",
      })
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    // Create a minimal app for development
    app = initializeApp({
      projectId: "demo-project",
    })
  }
} else {
  app = getApps()[0]
}

// Export Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export { app }
