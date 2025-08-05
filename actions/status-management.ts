import { Timestamp } from "firebase-admin/firestore"
import { db } from "../app/api/firebase-config"
import type { PotentialUser } from "../types"

// Helper function to standardize phone numbers
function standardizePhoneNumber(phone: string): string {
  if (!phone) return phone

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Handle German phone numbers
  if (cleaned.startsWith("49")) {
    return `+${cleaned}`
  } else if (cleaned.startsWith("0")) {
    return `+49${cleaned.slice(1)}`
  } else if (cleaned.length >= 10) {
    return `+49${cleaned}`
  }

  return phone
}

// Helper function to standardize plan values
function standardizePlan(plan: string, userType: string): string {
  // For trainers
  if (userType === "trainer" || userType === "coach") {
    if (plan === "coach") {
      return "pro"
    } else if (["pro", "elite"].includes(plan)) {
      return plan
    }
    return "pro" // Default for trainers
  }
  // For clients
  else {
    if (["basic", "premium"].includes(plan)) {
      return plan
    }
    return "basic" // Default for clients
  }
}

export const convertPotentialUserToTrainer = async (potentialUserId: string, additionalTrainerData: any = {}) => {
  try {
    console.log("🔄 Starting convertPotentialUserToTrainer for:", potentialUserId)

    // 1. Get the potential user data
    const potentialUserDoc = await db.collection("potential_users").doc(potentialUserId).get()

    if (!potentialUserDoc.exists) {
      console.error("❌ Potential user not found:", potentialUserId)
      return { success: false, message: "Potential user not found" }
    }

    const potentialUserData = potentialUserDoc.data() as PotentialUser

    if (!potentialUserData) {
      console.error("❌ Potential user data is missing")
      return { success: false, message: "Potential user data is missing" }
    }

    console.log("✅ Found potential user:", potentialUserData.email)

    // 2. Validate email and phone number
    if (!potentialUserData.email) {
      return { success: false, message: "Email is required" }
    }

    // Standardize phone number if it exists
    if (potentialUserData.phone) {
      try {
        potentialUserData.phone = standardizePhoneNumber(potentialUserData.phone)
      } catch (error: any) {
        console.error("Error standardizing phone number:", error)
        return { success: false, message: error.message }
      }
    }

    const now = Timestamp.now()

    // 3. Create the new trainer document
    const trainerData = {
      // Standard fields
      createdAt: now,
      updatedAt: now,

      // Status
      status: "active",
      activatedAt: now,

      // Fields from potential user
      email: potentialUserData.email,
      name: potentialUserData.name || potentialUserData.email.split("@")[0],
      phone: potentialUserData.phone,
      city: potentialUserData.city,
      district: potentialUserData.district,

      // Trainer-specific fields
      isActive: true,
      websiteCreated: true,

      // Connection to potential user
      potentialUserId: potentialUserId,
      fromWaitlist: true,

      // Additional data
      ...additionalTrainerData,
      // Standardize plan if provided
      plan: standardizePlan(additionalTrainerData.plan || potentialUserData.plan || "pro", "trainer"),
    }

    console.log("🔄 Creating trainer document...")

    // 4. Add the trainer to the trainers collection
    const trainerRef = await db.collection("trainers").add(trainerData)
    const trainerId = trainerRef.id

    console.log("✅ Trainer created with ID:", trainerId)

    // 5. Update the potential user document
    await db.collection("potential_users").doc(potentialUserId).update({
      convertedToTrainer: true,
      trainerId: trainerId,
      status: "website created",
      updatedAt: Timestamp.now(),
    })

    console.log("✅ Updated potential user with trainer info")

    return {
      success: true,
      trainerId: trainerId,
      message: "Potential user successfully converted to trainer",
      trainerData: {
        id: trainerId,
        email: potentialUserData.email,
        name: trainerData.name,
        city: potentialUserData.city,
      },
    }
  } catch (error: any) {
    console.error("❌ Error converting potential user to trainer:", error)
    return { success: false, message: error.message }
  }
}

// Keep the original function for backward compatibility
export const convertPotentialUserToUser = async (potentialUserId: string, additionalUserData: any = {}) => {
  try {
    // 1. Get the potential user data
    const potentialUserDoc = await db.collection("potential_users").doc(potentialUserId).get()

    if (!potentialUserDoc.exists) {
      return { success: false, message: "Potential user not found" }
    }

    const potentialUserData = potentialUserDoc.data() as PotentialUser

    if (!potentialUserData) {
      return { success: false, message: "Potential user data is missing" }
    }

    // 2. Validate email and phone number
    if (!potentialUserData.email) {
      return { success: false, message: "Email is required" }
    }

    // Standardize phone number if it exists
    if (potentialUserData.phone) {
      try {
        potentialUserData.phone = standardizePhoneNumber(potentialUserData.phone)
      } catch (error: any) {
        console.error("Error standardizing phone number:", error)
        return { success: false, message: error.message }
      }
    }

    const now = Timestamp.now()

    // Determine user_type based on existing data
    const user_type =
      potentialUserData.user_type ||
      (potentialUserData.role === "trainer" || potentialUserData.role === "coach" || potentialUserData.plan === "coach"
        ? "trainer"
        : "client")

    // 3. Create the new user document with simplified structure
    const userData = {
      // Standard fields
      createdAt: now,
      updatedAt: now,

      // Simplified status
      status: "pending",
      pendingAt: now,

      // Fields from potential user
      email: potentialUserData.email,
      user_type, // Use user_type instead of role
      hasTrainer: false, // Use hasTrainer instead of hasCoach

      // Connection to potential user
      potentialUserId: potentialUserId,
      fromWaitlist: true,

      // Additional data
      ...additionalUserData,
      // Standardize plan if provided
      plan: standardizePlan(additionalUserData.plan || potentialUserData.plan || "basic", user_type),
    }

    // 4. Add the user to the users collection
    const userRef = await db.collection("users").add(userData)
    const userId = userRef.id

    // 5. Update the potential user document
    await db.collection("potential_users").doc(potentialUserId).update({
      convertedToUser: true,
      userId: userId,
      updatedAt: Timestamp.now(),
    })

    return {
      success: true,
      userId: userId,
      message: "Potential user successfully converted to user",
      user_type, // Use user_type instead of role
    }
  } catch (error: any) {
    console.error("Error converting potential user to user:", error)
    return { success: false, message: error.message }
  }
}
