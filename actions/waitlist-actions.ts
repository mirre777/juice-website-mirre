"use server"

import { db, hasRealFirebaseConfig } from "@/app/api/firebase-config"
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { headers } from "next/headers"

function standardizePlan(plan: string, userType: string): string {
  if (userType === "trainer" || userType === "coach") {
    if (plan === "coach") return "pro"
    if (["pro", "elite"].includes(plan)) return plan
    return "pro"
  } else {
    if (["basic", "premium"].includes(plan)) return plan
    return "basic"
  }
}

export async function joinWaitlist(formData: FormData) {
  console.log("=== SERVER ACTION STARTED ===")
  console.log("Server action called with formData:", Object.fromEntries(formData.entries()))

  try {
    const email = formData.get("email") as string
    const city = formData.get("city") as string
    const phone = formData.get("phone") as string
    const plan = formData.get("plan") as string
    const message = formData.get("message") as string
    const numClients = formData.get("numClients") as string
    const userType = formData.get("user_type") as string

    console.log("Extracted values:", {
      email,
      city,
      phone,
      plan,
      userType,
      numClients,
    })

    // Basic validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.log("Email validation failed")
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    if (!phone || phone.trim().length < 8) {
      console.log("Phone validation failed")
      return {
        success: false,
        message: "Please provide a valid phone number.",
      }
    }

    if (!city || city.trim().length < 2) {
      console.log("City validation failed")
      return {
        success: false,
        message: "Please provide a valid city name.",
      }
    }

    if (!userType || !["client", "trainer"].includes(userType)) {
      console.log("User type validation failed:", userType)
      return {
        success: false,
        message: "Please select whether you're a client or trainer.",
      }
    }

    console.log("All validations passed")

    // Get origin
    let origin = ""
    try {
      const headersList = headers()
      origin = headersList.get("origin") || ""
      console.log("Origin:", origin)
    } catch (e) {
      console.error("Could not get headers:", e)
    }

    // Check if we have real Firebase config
    console.log("Checking Firebase config...")
    console.log("hasRealFirebaseConfig:", hasRealFirebaseConfig)
    console.log("db exists:", !!db)

    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock Firebase configuration - simulating success")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        success: true,
        message: "You've been added to our waitlist! (Preview Mode)",
      }
    }

    // Check if db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized")
      console.error("db:", db)
      console.error("db.app:", db?.app)
      return {
        success: false,
        message: "Database connection error. Please try again later.",
        error: "Firebase database not initialized",
      }
    }

    console.log("Firebase database is initialized, proceeding...")

    // Check for existing email
    console.log("Checking for existing email...")
    try {
      const potentialUsersRef = collection(db, "potential_users")
      console.log("Created collection reference")

      const emailQuery = query(potentialUsersRef, where("email", "==", email.toLowerCase().trim()))
      console.log("Created email query")

      const querySnapshot = await getDocs(emailQuery)
      console.log("Executed query, found", querySnapshot.size, "documents")

      if (!querySnapshot.empty) {
        console.log("Email already exists in waitlist:", email)
        return {
          success: true,
          message: "You're already on the list! We'll notify you when we launch.",
          alreadyExists: true,
        }
      }
    } catch (queryError) {
      console.error("Error checking existing email:", queryError)
      console.error("Query error details:", {
        name: queryError.name,
        message: queryError.message,
        stack: queryError.stack,
      })
      // Continue with registration if query fails
    }

    console.log("Preparing data for Firestore...")

    // Prepare data for Firestore
    const waitlistData: any = {
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      city: city.trim(),
      plan: standardizePlan(plan || "unknown", userType),
      message: message || "",
      created_at: serverTimestamp(),
      status: "waitlist",
      source: "website_waitlist",
      user_type: userType,
      signUpDate: new Date().toISOString(),
      origin,
      fromWaitlist: true,
    }

    if (numClients) {
      const clientCount = Number.parseInt(numClients, 10)
      if (!isNaN(clientCount) && clientCount >= 0) {
        waitlistData.numClients = clientCount
      }
    }

    console.log("Data prepared for saving:", waitlistData)

    // Add to Firebase
    console.log("Attempting to save to Firebase...")
    try {
      const potentialUsersRef = collection(db, "potential_users")
      console.log("Collection reference created successfully")

      const docRef = await addDoc(potentialUsersRef, waitlistData)
      console.log("Document written successfully with ID:", docRef.id)

      return {
        success: true,
        message: "You've been added to our waitlist! We'll notify you when we launch.",
      }
    } catch (addDocError) {
      console.error("Error adding document to Firestore:", addDocError)
      console.error("AddDoc error details:", {
        name: addDocError.name,
        message: addDocError.message,
        code: addDocError.code,
        stack: addDocError.stack,
      })

      return {
        success: false,
        message: "Failed to save to database. Please try again.",
        error: `Database write error: ${addDocError.message}`,
      }
    }
  } catch (error) {
    console.error("=== ERROR IN SERVER ACTION ===")
    console.error("Error details:", error)
    console.error("Error type:", typeof error)
    console.error("Error name:", error?.name)
    console.error("Error message:", error?.message)
    console.error("Error stack:", error?.stack)

    if (String(error).includes("collection") || String(error).includes("CollectionReference")) {
      return {
        success: false,
        message: "Database connection error. Please try again later.",
        error: "Firebase database not properly initialized",
      }
    }

    if (String(error).includes("permission")) {
      return {
        success: false,
        message: "Unable to save to database. Please check Firebase permissions.",
        error: "Firebase permission error",
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
