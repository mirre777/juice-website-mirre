import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

console.log("🔥 [FIREBASE CONFIG] Initializing Firebase...")

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
}

console.log("🔍 [FIREBASE CONFIG] Config check:", {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
})

// Initialize Firebase
let app
if (getApps().length === 0) {
  console.log("🚀 [FIREBASE CONFIG] Initializing new Firebase app...")
  app = initializeApp(firebaseConfig)
  console.log("✅ [FIREBASE CONFIG] Firebase app initialized successfully")
} else {
  console.log("♻️ [FIREBASE CONFIG] Using existing Firebase app")
  app = getApps()[0]
}

// Initialize Firestore
console.log("🔍 [FIREBASE CONFIG] Initializing Firestore...")
export const db = getFirestore(app)
console.log("✅ [FIREBASE CONFIG] Firestore initialized")

// Initialize Auth
console.log("🔍 [FIREBASE CONFIG] Initializing Auth...")
export const auth = getAuth(app)
console.log("✅ [FIREBASE CONFIG] Auth initialized")

export default app
