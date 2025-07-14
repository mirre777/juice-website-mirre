import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
export const db = getFirestore(app)

// Export app for other uses
export { app }

// Debug function to check configuration
export function getFirebaseDebugInfo() {
  return {
    hasApp: !!app,
    hasDb: !!db,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    configKeys: Object.keys(firebaseConfig),
    envVars: {
      FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: !!process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: !!process.env.FIREBASE_APP_ID,
    },
  }
}
