import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { logger } from "@/lib/logger"
import { getFirebaseDebugInfo } from "@/app/api/firebase-config"

// Server-side Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Client-side Firebase configuration (for components that need it)
const clientFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate required environment variables
function validateFirebaseConfig(config: any, configType: string) {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missing = requiredFields.filter((field) => !config[field])

  if (missing.length > 0) {
    logger.error(`Missing Firebase ${configType} environment variables`, {
      missing,
      available: Object.keys(config).filter((key) => config[key]),
    })
    throw new Error(`Missing Firebase ${configType} environment variables: ${missing.join(", ")}`)
  }
}

// Initialize Firebase app (singleton pattern)
function initializeFirebaseApp(isClient = false) {
  try {
    const config = isClient ? clientFirebaseConfig : firebaseConfig
    const configType = isClient ? "client" : "server"

    validateFirebaseConfig(config, configType)

    // Check if app already exists
    if (getApps().length > 0) {
      logger.debug(`Firebase app already initialized (${configType})`)
      return getApp()
    }

    logger.info(`Initializing Firebase app (${configType})`, {
      projectId: config.projectId,
      authDomain: config.authDomain,
    })

    const app = initializeApp(config)
    logger.info(`Firebase app initialized successfully (${configType})`)
    return app
  } catch (error) {
    logger.error("Failed to initialize Firebase app", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

// Initialize Firestore
function initializeFirestore() {
  try {
    const appInstance = initializeFirebaseApp(false) // Use server config
    const dbInstance = getFirestore(appInstance)

    // Connect to emulator in development if needed
    if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
      logger.info("Connecting to Firestore emulator", {
        host: process.env.FIRESTORE_EMULATOR_HOST,
      })
      connectFirestoreEmulator(dbInstance, "localhost", 8080)
    }

    logger.info("Firestore initialized successfully", {
      projectId: firebaseConfig.projectId,
    })

    return dbInstance
  } catch (error) {
    logger.error("Failed to initialize Firestore", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

// Helper function to check if Firestore is available
export function isFirestoreAvailable() {
  try {
    const { hasDb, projectId } = getFirebaseDebugInfo()
    return hasDb && !!projectId
  } catch (error) {
    console.error("Firestore availability check failed:", error)
    return false
  }
}

// Export configuration for debugging
export function getFirebaseConfig() {
  const debugInfo = getFirebaseDebugInfo()
  return {
    projectId: debugInfo.projectId,
    authDomain: debugInfo.authDomain,
    hasApiKey: debugInfo.envVars.FIREBASE_API_KEY,
    hasAppId: debugInfo.envVars.FIREBASE_APP_ID,
    hasApp: debugInfo.hasApp,
    hasDb: debugInfo.hasDb,
  }
}

// Export initialization functions
export function initializeFirebase() {
  return initializeFirebaseApp(false)
}

export function initializeClientFirebase() {
  return initializeFirebaseApp(true)
}
