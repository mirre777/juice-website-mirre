import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function hasRealFirebaseConfig(): boolean {
  const requiredVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

  return requiredVars.every((varName) => {
    const value = process.env[varName]
    return value && value.trim() !== "" && !value.includes("your-") && !value.includes("placeholder")
  })
}

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  if (!hasRealFirebaseConfig()) {
    console.warn("Firebase Admin not initialized: Missing or placeholder configuration")
    return null
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })

    return app
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error)
    return null
  }
}

export function getFirebaseAdmin() {
  const app = initializeFirebaseAdmin()
  if (!app) return null

  try {
    return {
      app,
      db: getFirestore(app),
    }
  } catch (error) {
    console.error("Failed to get Firestore instance:", error)
    return null
  }
}

export { hasRealFirebaseConfig }
