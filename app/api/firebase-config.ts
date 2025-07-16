import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
)

// Initialize Firebase Admin
let app
let db

try {
  if (hasRealFirebaseConfig && getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
    db = getFirestore(app)
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error)
}

export { app, db }

export function getFirebaseDebugInfo() {
  return {
    hasRealFirebaseConfig,
    projectId: process.env.FIREBASE_PROJECT_ID || "Not set",
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    appsLength: getApps().length,
  }
}
