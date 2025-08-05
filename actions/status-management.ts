import { db } from "@/app/api/firebase-config"
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"

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

export async function convertPotentialUserToTrainer(userId: string) {
  console.log("🔄 Starting convertPotentialUserToTrainer for:", userId)

  try {
    if (!db) {
      console.error("❌ Firebase database not configured")
      return {
        success: false,
        message: "Database not configured",
        trainerId: null,
        trainerData: null,
      }
    }

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
