"use server"

import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { headers } from "next/headers"

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

export async function joinWaitlist(formData: FormData) {
  console.log("Server action called with formData:", Object.fromEntries(formData.entries()))

  try {
    // Extract form data
    const email = formData.get("email") as string
    const city = formData.get("city") as string // New: Get city
    const phone = formData.get("phone") as string // New: Get phone
    const plan = formData.get("plan") as string
    const message = formData.get("message") as string
    const numClients = formData.get("numClients") as string // New: Get numClients

    // Get origin if possible
    let origin = ""
    try {
      const headersList = headers()
      origin = headersList.get("origin") || ""
      console.log("Request origin:", origin)
    } catch (e) {
      console.error("Could not get headers:", e)
    }

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.log("Email validation failed")
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    // Validate phone
    if (!phone || phone.trim().length < 8) {
      console.log("Phone validation failed")
      return {
        success: false,
        message: "Please provide a valid phone number.",
      }
    }

    // If we don't have real Firebase config, simulate success
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock Firebase configuration - simulating success")
      // Simulate a delay like a real database call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        message: "You've been added to our waitlist! (Preview Mode)",
      }
    }

    // Check if email already exists in the waitlist
    const potentialUsersRef = collection(db, "potential_users")
    const emailQuery = query(potentialUsersRef, where("email", "==", email))
    const querySnapshot = await getDocs(emailQuery)

    if (!querySnapshot.empty) {
      console.log("Email already exists in waitlist:", email)
      return {
        success: true,
        message: "You're already on the list! We'll notify you when we launch.",
        alreadyExists: true,
      }
    }

    // Get user_type from form or determine based on plan
    const formUserType = formData.get("user_type") as string
    const user_type = formUserType || (plan === "coach" ? "trainer" : "client")

    console.log("Setting user_type to:", user_type)

    // Create waitlist entry with additional metadata
    const waitlistData: { [key: string]: any } = {
      // Use index signature for dynamic properties
      email,
      phone: phone || "", // Add phone to waitlist data
      city: city || "", // Add city to waitlist data
      plan: standardizePlan(plan || "unknown", user_type),
      message: message || "",
      createdAt: serverTimestamp(),
      status: "waitlist", // Mark as waitlist entry
      source: "website_waitlist",
      user_type, // Use user_type instead of role
      signUpDate: new Date().toISOString(),
      origin,
      fromWaitlist: true,
    }

    // Add numClients only if it's provided (i.e., for trainers)
    if (numClients) {
      waitlistData.numClients = Number.parseInt(numClients, 10) // Parse to integer
    }

    console.log("Saving to Firebase collection 'potential_users':", waitlistData)

    // Add to Firebase - using potential_users collection
    const docRef = await addDoc(collection(db, "potential_users"), waitlistData)

    console.log("Document written with ID:", docRef.id)

    // Return success
    return {
      success: true,
      message: "You've been added to our waitlist! We'll notify you when we launch.",
    }
  } catch (error) {
    console.error("Error adding document:", error)

    // Check if it's a permission error
    if (String(error).includes("permission")) {
      return {
        success: false,
        message: "Unable to save to database. Please check Firebase permissions.",
        error:
          "Firebase permission error. Make sure your security rules allow writes to the 'potential_users' collection.",
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
