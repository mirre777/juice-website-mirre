/**
 * Safe Firebase wrapper that prevents build-time initialization
 * Use this instead of direct Firebase imports
 */

const isBuildTime = () => {
  return (
    typeof window === "undefined" &&
    ((process.env.NODE_ENV === "production" && !process.env.VERCEL) ||
      process.env.CI === "true" ||
      process.env.NEXT_PHASE === "phase-production-build")
  )
}

export const getFirebaseApp = async () => {
  if (isBuildTime()) {
    console.log("[Firebase] Build time detected - skipping initialization")
    return null
  }

  try {
    const { app } = await import("@/firebase")
    return app
  } catch (error) {
    console.error("[Firebase] Failed to initialize:", error)
    return null
  }
}

export const getFirestore = async () => {
  if (isBuildTime()) {
    return null
  }

  try {
    const { db } = await import("@/firebase")
    return db
  } catch (error) {
    console.error("[Firebase] Failed to get Firestore:", error)
    return null
  }
}

export const getFirestoreUtils = async () => {
  if (isBuildTime()) {
    return null
  }

  try {
    const firestore = await import("firebase/firestore")
    return {
      collection: firestore.collection,
      doc: firestore.doc,
      getDocs: firestore.getDocs,
      getDoc: firestore.getDoc,
      addDoc: firestore.addDoc,
      updateDoc: firestore.updateDoc,
      deleteDoc: firestore.deleteDoc,
      serverTimestamp: firestore.serverTimestamp,
      query: firestore.query,
      where: firestore.where,
      orderBy: firestore.orderBy,
      limit: firestore.limit,
    }
  } catch (error) {
    console.error("[Firebase] Failed to get Firestore utils:", error)
    return null
  }
}
