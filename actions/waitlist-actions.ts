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

// Timeout wrapper for Firebase operations
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

export async function joinWaitlist(formData: FormData) {
  console.log("Server action called with formData:", formData)

  // Check if formData is null or undefined
  if (!formData) {
    console.error("FormData is null or undefined")
    return {
      success: false,
      message: "Formulardaten fehlen. Bitte versuche es erneut.",
    }
  }

  try {
    // Convert FormData to object for logging
    const formEntries = Object.fromEntries(formData.entries())
    console.log("Form entries:", formEntries)

    // Extract form data with null checks
    const email = formData.get("email")?.toString() || ""
    const city = formData.get("city")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const plan = formData.get("plan")?.toString() || ""
    const message = formData.get("message")?.toString() || ""
    const numClients = formData.get("numClients")?.toString() || ""
    const userType = formData.get("user_type")?.toString() || "client"

    // Munich-specific fields
    const name = formData.get("name")?.toString() || ""
    const goal = formData.get("goal")?.toString() || ""
    const district = formData.get("district")?.toString() || ""
    const startTime = formData.get("startTime")?.toString() || ""

    console.log("Extracted data:", {
      email,
      city,
      phone,
      plan,
      userType,
      numClients,
      name,
      goal,
      district,
      startTime,
    })

    // Get origin if possible
    let origin = ""
    try {
      const headersList = headers()
      origin = headersList.get("origin") || ""
      console.log("Request origin:", origin)
    } catch (e) {
      console.error("Could not get headers:", e)
    }

    // Validate required fields
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.log("Email validation failed")
      return {
        success: false,
        message: "Bitte gib eine gültige E-Mail-Adresse ein.",
      }
    }

    // For Munich clients, validate additional required fields
    if (userType === "client" && city === "München") {
      if (!name || name.trim().length < 2) {
        return {
          success: false,
          message: "Bitte gib deinen Namen ein (mindestens 2 Zeichen).",
        }
      }

      if (!goal) {
        return {
          success: false,
          message: "Bitte wähle dein Trainingsziel aus.",
        }
      }

      if (!district) {
        return {
          success: false,
          message: "Bitte wähle deinen Stadtteil aus.",
        }
      }

      if (!startTime) {
        return {
          success: false,
          message: "Bitte wähle deinen gewünschten Startzeitpunkt aus.",
        }
      }
    }

    // Validate phone (optional, but if provided must be valid)
    if (phone && phone.trim().length > 0 && phone.trim().length < 8) {
      console.log("Phone validation failed")
      return {
        success: false,
        message: "Bitte gib eine gültige Telefonnummer ein oder lass das Feld leer.",
      }
    }

    // Validate city
    if (!city || city.trim().length < 2) {
      console.log("City validation failed")
      return {
        success: false,
        message: "Stadt ist erforderlich.",
      }
    }

    // Validate user type
    if (!userType || !["client", "trainer"].includes(userType)) {
      console.log("User type validation failed:", userType)
      return {
        success: false,
        message: "Bitte wähle aus, ob du Client oder Trainer bist.",
      }
    }

    console.log("✅ All validations passed")

    // If we don't have real Firebase config, simulate success
    if (!hasRealFirebaseConfig || !db) {
      console.log("Using mock Firebase configuration - simulating success")
      // Simulate a delay like a real database call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        message:
          "Perfekt! Wir melden uns in den nächsten 24 Stunden bei dir mit passenden Trainer-Vorschlägen. (Preview Mode)",
      }
    }

    // Check if Firebase db is properly initialized
    if (!db || typeof db.app === "undefined") {
      console.error("Firebase database not properly initialized:", db)
      return {
        success: false,
        message: "Datenbankverbindung fehlgeschlagen. Bitte versuche es später erneut.",
        error: "Firebase database not initialized",
      }
    }

    console.log("🔥 Firebase database is initialized, proceeding with operations...")

    // Check if email already exists in the waitlist (with timeout)
    try {
      console.log("📧 Checking if email already exists...")
      const potentialUsersRef = collection(db, "potential_users")
      const emailQuery = query(potentialUsersRef, where("email", "==", email.toLowerCase().trim()))

      const querySnapshot = await withTimeout(getDocs(emailQuery), 5000)

      if (!querySnapshot.empty) {
        console.log("Email already exists in waitlist:", email)
        return {
          success: true,
          message: "Du stehst bereits auf unserer Liste! Wir melden uns, sobald wir starten.",
          alreadyExists: true,
        }
      }
      console.log("✅ Email is unique, proceeding with registration")
    } catch (queryError) {
      console.error("Error checking existing email:", queryError)
      if (queryError.message.includes("timeout")) {
        console.log("⏰ Email check timed out, proceeding anyway...")
      }
      // Continue with registration if query fails
    }

    console.log("Setting user_type to:", userType)

    // Determine source based on form data
    let source = "website_waitlist"
    if (city === "München" && goal) {
      source = "munich-landing-page"
    } else if (userType === "trainer") {
      source = "trainer-signup"
    }

    // Create waitlist entry with additional metadata
    const waitlistData: { [key: string]: any } = {
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      city: city.trim(),
      plan: standardizePlan(plan || "unknown", userType),
      message: message || "",
      createdAt: serverTimestamp(),
      status: "waitlist",
      source: source,
      user_type: userType,
      signUpDate: new Date().toISOString(),
      origin,
      fromWaitlist: true,

      // Munich-specific fields
      name: name?.trim() || "",
      goal: goal || "",
      district: district || "",
      startTime: startTime || "",
    }

    // Add numClients only if it's provided (i.e., for trainers)
    if (numClients) {
      const clientCount = Number.parseInt(numClients, 10)
      if (!isNaN(clientCount) && clientCount >= 0) {
        waitlistData.numClients = clientCount
      }
    }

    console.log("💾 Saving to Firebase collection 'potential_users':", waitlistData)

    // Add to Firebase - using potential_users collection (with timeout)
    try {
      const docRef = await withTimeout(addDoc(collection(db, "potential_users"), waitlistData), 10000)

      console.log("✅ Document written with ID:", docRef.id)

      // Return success with appropriate message
      const successMessage =
        userType === "client" && city === "München"
          ? "Perfekt! Wir melden uns in den nächsten 24 Stunden bei dir mit passenden Trainer-Vorschlägen."
          : "Vielen Dank für deine Anmeldung! Wir melden uns bald bei dir."

      return {
        success: true,
        message: successMessage,
      }
    } catch (writeError) {
      console.error("💥 Firebase write error:", writeError)

      if (writeError.message.includes("timeout")) {
        return {
          success: false,
          message: "Die Anfrage dauert zu lange. Bitte versuche es erneut oder kontaktiere den Support.",
          error: "Firebase write operation timed out",
        }
      }

      throw writeError // Re-throw to be caught by outer catch block
    }
  } catch (error) {
    console.error("💥 Error adding document:", error)

    // Check if it's a Firebase initialization error
    if (String(error).includes("collection") || String(error).includes("CollectionReference")) {
      return {
        success: false,
        message: "Datenbankverbindung fehlgeschlagen. Bitte versuche es später erneut.",
        error: "Firebase database not properly initialized. Please check your Firebase configuration.",
      }
    }

    // Check if it's a permission error
    if (String(error).includes("permission")) {
      return {
        success: false,
        message: "Speichern in Datenbank nicht möglich. Bitte kontaktiere den Support.",
        error:
          "Firebase permission error. Make sure your security rules allow writes to the 'potential_users' collection.",
      }
    }

    // Check if it's a timeout error
    if (String(error).includes("timeout")) {
      return {
        success: false,
        message: "Die Anfrage dauert zu lange. Bitte versuche es erneut.",
        error: "Operation timed out",
      }
    }

    return {
      success: false,
      message: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
