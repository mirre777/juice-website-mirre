"use server"

import { db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function joinWaitlist(formData: FormData) {
  console.log("Server action called with formData:", Object.fromEntries(formData.entries()))

  try {
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const city = formData.get("city") as string
    const userType = formData.get("user_type") as string
    const numClients = formData.get("numClients") as string

    // Basic validation
    if (!email || !phone || !city || !userType) {
      console.log("Missing required fields")
      return {
        success: false,
        error: "Missing required fields",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format")
      return {
        success: false,
        error: "Invalid email format",
      }
    }

    // Validate phone number (minimum 8 characters)
    if (phone.length < 8) {
      console.log("Phone number must be at least 8 characters long")
      return {
        success: false,
        error: "Phone number must be at least 8 characters long",
      }
    }

    // Prepare data for Firestore
    const waitlistData: any = {
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      city: city.trim(),
      user_type: userType,
      status: "waitlist",
      created_at: serverTimestamp(),
    }

    // Add numClients if provided and user is trainer
    if (userType === "trainer" && numClients) {
      const clientCount = Number.parseInt(numClients)
      if (!isNaN(clientCount) && clientCount >= 0) {
        waitlistData.numClients = clientCount
      }
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, "potential_users"), waitlistData)

    console.log("User added to waitlist:", docRef.id)

    return {
      success: true,
      message: "Successfully added to waitlist",
    }
  } catch (error) {
    console.error("Error adding to waitlist:", error)
    return {
      success: false,
      error: "Failed to join waitlist. Please try again.",
    }
  }
}
