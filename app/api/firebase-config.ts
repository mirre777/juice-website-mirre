// Server-side Firebase Admin configuration
let adminDb: any = null
let isInitialized = false

export function hasFirebaseConfig(): boolean {
  const required = [
    process.env.FIREBASE_PROJECT_ID,
    process.env.FIREBASE_CLIENT_EMAIL,
    process.env.FIREBASE_PRIVATE_KEY,
  ]
  return required.every((val) => val && val.length > 0)
}

export async function getAdminDb() {
  if (adminDb) return adminDb

  if (!hasFirebaseConfig()) {
    console.warn("Firebase Admin config missing")
    return null
  }

  try {
    // Dynamic import to avoid client-side issues
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    if (!isInitialized && getApps().length === 0) {
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })

      adminDb = getFirestore(app)
      isInitialized = true
      console.log("Firebase Admin initialized")
    } else if (getApps().length > 0) {
      adminDb = getFirestore()
    }

    return adminDb
  } catch (error) {
    console.error("Firebase Admin init error:", error)
    return null
  }
}

// Client-side Firebase config (for frontend use)
export const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}
