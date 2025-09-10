/**
 * Global Firebase Build-Time Protection Service
 *
 * This service provides comprehensive build-time detection and prevents
 * any Firebase initialization during Next.js build process across all routes.
 *
 * Read docs/FIREBASE_BUILD_ISSUES.md for detailed explanation.
 */

const isBuildTime = () => {
  return (
    process.env.NODE_ENV === "production" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.CI === "true" ||
      process.env.VERCEL_ENV === undefined ||
      (typeof window === "undefined" && !process.env.VERCEL_URL))
  )
}

let firebaseClientDb: any = null
let firebaseAdminDb: any = null

export async function getFirebaseClientDb() {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping Firebase client initialization")
    throw new Error("Firebase client not available during build time")
  }

  if (!firebaseClientDb) {
    const [{ initializeApp, getApps }, { getFirestore }] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ])

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    firebaseClientDb = getFirestore(app)
  }

  return firebaseClientDb
}

export async function getFirebaseAdminDb() {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping Firebase admin initialization")
    throw new Error("Firebase admin not available during build time")
  }

  if (!firebaseAdminDb) {
    const [{ initializeApp, getApps, cert }, { getFirestore }] = await Promise.all([
      import("firebase-admin/app"),
      import("firebase-admin/firestore"),
    ])

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    }

    firebaseAdminDb = getFirestore()
  }

  return firebaseAdminDb
}

export function createBuildTimeGuard(routeName: string) {
  return (req: any, res: any, next?: any) => {
    if (isBuildTime()) {
      console.log(`Build time detected - completely skipping ${routeName} route`)
      const response = new Response("Build time - route disabled", { status: 503 })
      return response
    }
    return next ? next() : null
  }
}

export { isBuildTime }
