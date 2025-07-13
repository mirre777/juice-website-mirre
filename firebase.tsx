// Firebase configuration for client-side usage
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Use environment variables if available, otherwise use mock values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Check if we have real Firebase configuration
const hasRealFirebaseConfig =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"

let db: any = null
let app: any = null

if (hasRealFirebaseConfig) {
  try {
    // Initialize Firebase app with real config
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

    // Only initialize Firestore if we have a valid project ID
    if (firebaseConfig.projectId && firebaseConfig.projectId !== "mock-project-id") {
      db = getFirestore(app)
      console.log("Client-side Firebase initialized with real configuration")
    } else {
      console.log("Firebase app initialized but Firestore not available")
      db = null
    }
  } catch (error) {
    console.warn("Client-side Firebase initialization failed, using mock mode:", error)
    db = null
    app = null
  }
} else {
  // Use null for mock scenarios - the actions will handle this
  db = null
  app = null
  console.log("Using mock Firebase configuration on client-side")
}

export { db, app, hasRealFirebaseConfig }
