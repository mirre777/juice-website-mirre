import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

console.log("🔥 [FIREBASE CONFIG] Starting Firebase initialization...")

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
}

console.log("🔍 [FIREBASE CONFIG] Firebase config check:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  projectId: firebaseConfig.projectId,
})

// Check if we have the minimum required config
const hasRequiredConfig = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

console.log("🔍 [FIREBASE CONFIG] Has required config:", hasRequiredConfig)

if (!hasRequiredConfig) {
  console.log("❌ [FIREBASE CONFIG] Missing required Firebase configuration")
  console.log("Missing:", {
    apiKey: !firebaseConfig.apiKey,
    authDomain: !firebaseConfig.authDomain,
    projectId: !firebaseConfig.projectId,
  })
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore
let auth: Auth

try {
  console.log("🚀 [FIREBASE CONFIG] Initializing Firebase app...")
  
  // Check if Firebase is already initialized
  const existingApps = getApps()
  console.log("🔍 [FIREBASE CONFIG] Existing Firebase apps:", existingApps.length)

  if (existingApps.length === 0) {
    console.log("🔥 [FIREBASE CONFIG] Creating new Firebase app...")
    app = initializeApp(firebaseConfig)
    console.log("✅ [FIREBASE CONFIG] Firebase app created successfully")
  } else {
    console.log("♻️ [FIREBASE CONFIG] Using existing Firebase app...")
    app = existingApps[0]
  }

  console.log("🔍 [FIREBASE CONFIG] Firebase app details:", {
    name: app.name,
    options: {
      projectId: app.options.projectId,
      authDomain: app.options.authDomain,
    }
  })

  // Initialize Firestore
  console.log("🚀 [FIREBASE CONFIG] Initializing Firestore...")
  db = getFirestore(app)
  console.log("✅ [FIREBASE CONFIG] Firestore initialized successfully")

  // Initialize Auth
  console.log("🚀 [FIREBASE CONFIG] Initializing Auth...")
  auth = getAuth(app)
  console.log("✅ [FIREBASE CONFIG] Auth initialized successfully")

  console.log("🎉 [FIREBASE CONFIG] Firebase initialization completed successfully!")

} catch (error) {
  console.log("💥 [FIREBASE CONFIG] Firebase initialization error:")
  console.log("Error type:", typeof error)
  console.log("Error constructor:", error?.constructor?.name)
  console.log("Error message:", error instanceof Error ? error.message : String(error))
  console.log("Error stack:", error instanceof Error ? error.stack : "No stack trace")
  console.log("Full error object:", error)

  // Create fallback objects to prevent import errors
  console.log("🔧 [FIREBASE CONFIG] Creating fallback objects...")
  app = {} as FirebaseApp
  db = {} as Firestore
  auth = {} as Auth
}

// Export the initialized services
export { app, db, auth }

// Default export for backward compatibility
export default app
