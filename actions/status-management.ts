import { Timestamp } from "firebase-admin/firestore"
import { db } from "../lib/firebase"
import type { PotentialUser, StatusTransition } from "../types"
import { standardizePhoneNumber } from "../utils"

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

    // 6. Record new user status "pending"
    const userTransition: StatusTransition = {
      potentialUserId: potentialUserId,
      userId: userId,
      email: potentialUserData.email,
      previousStatus: "",
      newStatus: "pending",
      timestamp: Timestamp.now(),
      reason: "Initial account creation",
      source: "users",
      userType: user_type, // Use user_type instead of role
    }

    await db.collection("status_transitions").add(userTransition)

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
