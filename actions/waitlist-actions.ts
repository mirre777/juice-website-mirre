"use server"

import { db } from "@/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { headers } from "next/headers" // Import headers function

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
    const plan = formData.get("plan") as string
    const message = formData.get("message") as string
    const numClients = formData.get("numClients") as string // New: Get numClients
    const userType = formData.get("user_type") as string

    // Get origin if possible
    let origin = ""
    try {
      const headersList = headers()
      origin = headersList.get("origin") || ""
      console.log("Request origin:", origin)
    } catch (e) {
      console.error("Could not get headers:", e)
    }

    // Validate email and city
    if (!email || !city || !/^\S+@\S+\.\S+$/.test(email)) {
      console.log("Email or city validation failed")
      return {
        success: false,
        message: "Please provide a valid email address and city.",
      }
    }

    // Check if email already exists in the waitlist
    const waitlistRef = collection(db, "waitlist")
    const emailQuery = query(waitlistRef, where("email", "==", email))
    const querySnapshot = await getDocs(emailQuery)

    if (!querySnapshot.empty) {
      console.log("Email already exists in waitlist:", email)
      return {
        success: true,
        message: "You're already on our waitlist!",
        alreadyExists: true,
      }
    }

    // Create waitlist entry with additional metadata
    const waitlistData: { [key: string]: any } = {
      // Use index signature for dynamic properties
      email,
      city,
      plan: standardizePlan(plan || "unknown", userType),
      message: message || "",
      createdAt: new Date(),
      status: "waitlist", // Mark as waitlist entry
      source: "website_waitlist",
      userType: userType || "client", // Use user_type instead of role
      signUpDate: new Date().toISOString(),
      origin,
      fromWaitlist: true,
    }

    // Add numClients only if it's provided (i.e., for trainers)
    if (numClients) {
      waitlistData.numClients = Number.parseInt(numClients, 10) // Parse to integer
    }

    console.log("Saving to Firebase collection 'waitlist':", waitlistData)

    // Add to Firebase - using waitlist collection
    const docRef = await addDoc(waitlistRef, waitlistData)

    console.log("Document written with ID:", docRef.id)

    // Return success
    return {
      success: true,
      message: "Successfully added to waitlist!",
    }
  } catch (error) {
    console.error("Error adding document:", error)

    // Check if it's a permission error
    if (String(error).includes("permission")) {
      return {
        success: false,
        message: "Unable to save to database. Please check Firebase permissions.",
        error: "Firebase permission error. Make sure your security rules allow writes to the 'waitlist' collection.",
      }
    }

    return {
      success: false,
      message: "Failed to join waitlist. Please try again.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
