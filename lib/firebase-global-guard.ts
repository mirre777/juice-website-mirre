/**
 * Global Firebase Build-Time Protection Service
 *
 * This service provides comprehensive build-time detection and prevents
 * any Firebase initialization during Next.js build process across all routes.
 *
 * Read docs/FIREBASE_BUILD_ISSUES.md for detailed explanation.
 */

const isBuildTime = () => {
  return process.env.NEXT_PHASE === "phase-production-build"
}

let firebaseClientDb: any = null
let firebaseAdminDb: any = null
let firebaseWebappAdminDb: any = null

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

export async function getFirebaseWebappAdminDb() {
  console.log("[DEBUG] getFirebaseWebappAdminDb called")
  
  if (isBuildTime()) {
    console.log("[DEBUG] Build time detected - completely skipping Firebase webapp admin initialization")
    throw new Error("Firebase webapp admin not available during build time")
  }

  if (!firebaseWebappAdminDb) {
    console.log("[DEBUG] Initializing Firebase webapp admin DB...")
    console.log("[DEBUG] Environment variables at initialization:")
    console.log("[DEBUG]   WEBAPP_FIREBASE_PROJECT_ID:", process.env.WEBAPP_FIREBASE_PROJECT_ID ? `SET (${process.env.WEBAPP_FIREBASE_PROJECT_ID})` : "MISSING")
    console.log("[DEBUG]   WEBAPP_FIREBASE_CLIENT_EMAIL:", process.env.WEBAPP_FIREBASE_CLIENT_EMAIL ? `SET (${process.env.WEBAPP_FIREBASE_CLIENT_EMAIL})` : "MISSING")
    console.log("[DEBUG]   WEBAPP_FIREBASE_PRIVATE_KEY:", process.env.WEBAPP_FIREBASE_PRIVATE_KEY ? `SET (length: ${process.env.WEBAPP_FIREBASE_PRIVATE_KEY.length}, starts with: ${process.env.WEBAPP_FIREBASE_PRIVATE_KEY.substring(0, 30)}...)` : "MISSING")
    
    try {
      const [{ initializeApp, getApps, cert }, { getFirestore }] = await Promise.all([
        import("firebase-admin/app"),
        import("firebase-admin/firestore"),
      ])

      const appName = "webapp-firebase-admin"
      let app = getApps().find((a) => a.name === appName)

      if (!app) {
        console.log("[DEBUG] Creating new Firebase app instance...")
        const projectId = process.env.WEBAPP_FIREBASE_PROJECT_ID
        const clientEmail = process.env.WEBAPP_FIREBASE_CLIENT_EMAIL
        const privateKey = process.env.WEBAPP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
        
        if (!projectId || !clientEmail || !privateKey) {
          console.error("[DEBUG] Missing required Firebase credentials!")
          throw new Error("Missing Firebase webapp admin credentials")
        }
        
        app = initializeApp(
          {
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          },
          appName,
        )
        console.log("[DEBUG] Firebase app initialized successfully")
      } else {
        console.log("[DEBUG] Using existing Firebase app instance")
      }

      firebaseWebappAdminDb = getFirestore(app)
      console.log("[DEBUG] Firestore instance created successfully")
    } catch (error) {
      console.error("[DEBUG] Error initializing Firebase webapp admin:", error)
      console.error("[DEBUG] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      throw error
    }
  } else {
    console.log("[DEBUG] Using cached Firebase webapp admin DB")
  }

  return firebaseWebappAdminDb
}

export { isBuildTime }
