// This file handles Firebase configuration for both client and server environments
// It uses regular Firebase SDK for client-side and Firebase Admin for server-side

// For client-side Firebase (works in browser)
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if we have real Firebase configuration
export const hasRealFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-api-key"
)

// Initialize Firebase client
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

// Initialize Firestore
export const db = getFirestore(app)

export { app }

// For server-side Firebase Admin (only works in API routes)
export async function getAdminDb() {
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin can only be used on the server side")
  }

  try {
    const { initializeApp: initializeAdminApp, getApps: getAdminApps, cert } = await import("firebase-admin/app")
    const { getFirestore: getAdminFirestore } = await import("firebase-admin/firestore")

    const hasAdminConfig = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    )

    if (!hasAdminConfig) {
      return null
    }

    let adminApp
    if (getAdminApps().length === 0) {
      adminApp = initializeAdminApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    } else {
      adminApp = getAdminApps()[0]
    }

    return getAdminFirestore(adminApp)
  } catch (error) {
    console.error("Firebase Admin initialization error:", error)
    return null
  }
}

export function getFirebaseDebugInfo() {
  return {
    hasRealConfig: hasRealFirebaseConfig,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "not-set",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "not-set",
    hasApp: !!app,
    hasDb: !!db,
    envVars: {
      FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
  }
}
