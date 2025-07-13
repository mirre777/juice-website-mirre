"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, type Storage } from "firebase/storage"

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Get Firebase configuration from environment variables (client-side)
function getClientFirebaseConfig(): FirebaseConfig | null {
  // Use NEXT_PUBLIC_ prefixed environment variables for client-side
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  // Check if all required fields are present
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingFields = requiredFields.filter((field) => !config[field as keyof typeof config])

  if (missingFields.length > 0) {
    console.warn(`Missing client Firebase configuration fields: ${missingFields.join(", ")}`)
    return null
  }

  return config as FirebaseConfig
}

// Mock Firebase configuration for development
const mockConfig: FirebaseConfig = {
  apiKey: "mock-api-key-client",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "demo-project-client",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
}

// Initialize Firebase app (client-side)
let clientApp: FirebaseApp
let clientDb: Firestore
let clientAuth: Auth
let clientStorage: Storage

try {
  const config = getClientFirebaseConfig() || mockConfig

  // Initialize Firebase app if not already initialized
  if (typeof window !== "undefined" && getApps().length === 0) {
    clientApp = initializeApp(config, "client-app")
    console.log(`Client Firebase initialized with project: ${config.projectId}`)
  } else if (typeof window !== "undefined") {
    clientApp = getApps()[0]
  }

  if (typeof window !== "undefined") {
    // Initialize Firestore
    clientDb = getFirestore(clientApp)

    // Initialize Auth
    clientAuth = getAuth(clientApp)

    // Initialize Storage
    clientStorage = getStorage(clientApp)
  }
} catch (error) {
  console.error("Client Firebase initialization error:", error)

  if (typeof window !== "undefined") {
    // Fallback initialization with mock config
    if (getApps().length === 0) {
      clientApp = initializeApp(mockConfig, "client-app-fallback")
    } else {
      clientApp = getApps()[0]
    }

    clientDb = getFirestore(clientApp)
    clientAuth = getAuth(clientApp)
    clientStorage = getStorage(clientApp)
  }
}

// Export client Firebase services
export { clientApp as app, clientDb as db, clientAuth as auth, clientStorage as storage }

// Export configuration info
export const clientFirebaseConfig = getClientFirebaseConfig() || mockConfig
export const isUsingClientMockConfig = !getClientFirebaseConfig()

// Client-side debug function
export function debugClientFirebaseConfig() {
  const config = getClientFirebaseConfig()
  console.log("Client Firebase Configuration Debug:", {
    hasConfig: !!config,
    projectId: config?.projectId || "Not set",
    isUsingMock: isUsingClientMockConfig,
    availableEnvVars: {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    },
  })
}
