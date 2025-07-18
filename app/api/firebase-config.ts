import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Check if we have real Firebase configuration
export function hasRealFirebaseConfig(): boolean {
  try {
    const requiredEnvVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]

    const hasAllVars = requiredEnvVars.every((varName) => {
      const value = process.env[varName]
      return value && value.trim() !== "" && !value.includes("your-") && !value.includes("placeholder")
    })

    return hasAllVars
  } catch (error) {
    console.error("Error checking Firebase config:", error)
    return false
  }
}

// Initialize Firebase Admin
let app
let db

try {
  if (!hasRealFirebaseConfig()) {
    console.warn("Firebase: Using mock configuration - some features may not work")
    // Create a mock db object for development
    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false, data: () => null }),
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve(),
        }),
        add: () => Promise.resolve({ id: "mock-id" }),
        where: () => ({
          get: () => Promise.resolve({ empty: true, docs: [] }),
        }),
        get: () => Promise.resolve({ empty: true, docs: [] }),
      }),
    }
  } else {
    // Initialize with real Firebase config
    if (getApps().length === 0) {
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
      app = getApps()[0]
    }

    db = getFirestore(app)
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Fallback to mock
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      add: () => Promise.resolve({ id: "mock-id" }),
      where: () => ({
        get: () => Promise.resolve({ empty: true, docs: [] }),
      }),
      get: () => Promise.resolve({ empty: true, docs: [] }),
    }),
  }
}

export { db }
export default app
