"use server"

// Utility function to standardize phone numbers
function standardizePhoneNumber(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // If it starts with 49 (Germany country code), keep as is
  if (cleaned.startsWith("49")) {
    return `+${cleaned}`
  }

  // If it starts with 0, replace with +49
  if (cleaned.startsWith("0")) {
    return `+49${cleaned.slice(1)}`
  }

  // If it's just digits without country code, assume German and add +49
  if (cleaned.length >= 10) {
    return `+49${cleaned}`
  }

  // Return original if we can't standardize
  return phone
}

// Initialize Firebase modules only when needed and not during build time
let dbInstance: any = null
let collectionInstance: any = null
let docInstance: any = null
let getDocInstance: any = null
let addDocInstance: any = null
let updateDocInstance: any = null
let serverTimestampInstance: any = null

async function initializeFirebase() {
  const isBuildTime = process.env.NODE_ENV === "production" && !process.env.VERCEL

  if (isBuildTime || dbInstance) {
    return dbInstance !== null
  }

  try {
    const firebaseConfig = await import("@/app/api/firebase-config")
    dbInstance = firebaseConfig.db

    if (!dbInstance) {
      console.log("Firebase not available in status management")
      return false
    }

    const firestore = await import("firebase/firestore")
    collectionInstance = firestore.collection
    docInstance = firestore.doc
    getDocInstance = firestore.getDoc
    addDocInstance = firestore.addDoc
    updateDocInstance = firestore.updateDoc
    serverTimestampInstance = firestore.serverTimestamp

    return true
  } catch (error) {
    console.log("Firebase not available during build:", error)
    return false
  }
}

export async function convertPotentialUserToTrainer(userId: string) {
  console.log("🔄 Starting convertPotentialUserToTrainer for:", userId)

  try {
    const firebaseAvailable = await initializeFirebase()

    if (!firebaseAvailable || !dbInstance) {
      console.error("❌ Firebase database not configured")
      return {
        success: false,
        message: "Database not configured",
        trainerId: null,
        trainerData: null,
      }
    }

    const db = dbInstance
    const collection = collectionInstance
    const doc = docInstance
    const getDoc = getDocInstance
    const addDoc = addDocInstance
    const updateDoc = updateDocInstance
    const serverTimestamp = serverTimestampInstance

    console.log("✅ Database configured, fetching potential user...")

    // Get the potential user data
    const potentialUserRef = doc(db, "potential_users", userId)
    const potentialUserSnap = await getDoc(potentialUserRef)

    if (!potentialUserSnap.exists()) {
      console.error("❌ Potential user not found:", userId)
      return {
        success: false,
        message: "Potential user not found",
        trainerId: null,
        trainerData: null,
      }
    }

    const potentialUserData = potentialUserSnap.data()
    console.log("📊 Potential user data:", potentialUserData)

    // Check if already converted
    if (potentialUserData.convertedToTrainer) {
      console.log("⚠️ User already converted to trainer")
      return {
        success: false,
        message: "User already converted to trainer",
        trainerId: potentialUserData.trainerId || null,
        trainerData: null,
      }
    }

    // Prepare trainer data
    const trainerData = {
      // Basic info
      name: potentialUserData.fullName || potentialUserData.name || "Unknown",
      email: potentialUserData.email || "",
      phone: standardizePhoneNumber(potentialUserData.phoneNumber || potentialUserData.phone || ""),

      // Location
      city: potentialUserData.city || "",
      district: potentialUserData.district || "",
      location:
        potentialUserData.location ||
        `${potentialUserData.city || ""}, ${potentialUserData.district || ""}`.replace(/, $/, ""),

      // Goals and specialization
      goal: potentialUserData.goal || "",
      specialization: potentialUserData.goal || "",

      // Metadata
      status: "website_created",
      user_type: "trainer",
      source: potentialUserData.source || "admin_conversion",
      originalPotentialUserId: userId,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      convertedAt: serverTimestamp(),

      // Additional fields
      isActive: true,
      websiteStatus: "created",
      profileComplete: false,
    }

    console.log("📝 Creating trainer with data:", trainerData)

    // Create new trainer document
    const trainersCollection = collection(db, "trainers")
    const trainerDocRef = await addDoc(trainersCollection, trainerData)
    const trainerId = trainerDocRef.id

    console.log("✅ Trainer created with ID:", trainerId)

    // Update the original potential user
    await updateDoc(potentialUserRef, {
      convertedToTrainer: true,
      trainerId: trainerId,
      status: "website_created",
      updatedAt: serverTimestamp(),
      convertedAt: serverTimestamp(),
    })

    console.log("✅ Updated potential user with conversion info")

    return {
      success: true,
      message: "Successfully converted to trainer",
      trainerId: trainerId,
      trainerData: {
        ...trainerData,
        id: trainerId,
      },
    }
  } catch (error) {
    console.error("❌ Error in convertPotentialUserToTrainer:", error)
    console.error("🔍 Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      trainerId: null,
      trainerData: null,
    }
  }
}
