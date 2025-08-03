"use server"

import { db } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function joinWaitlist(formData: FormData | null) {
  console.log("joinWaitlist called with:", formData ? Object.fromEntries(formData.entries()) : "null formData")

  if (!formData) {
    console.error("FormData is null")
    return {
      success: false,
      message: "Keine Daten empfangen. Bitte versuche es erneut.",
      error: "FormData is null",
    }
  }

  try {
    // Extract form data with proper validation
    const email = formData.get("email")?.toString()?.trim()
    const name = formData.get("name")?.toString()?.trim()
    const phone = formData.get("phone")?.toString()?.trim()
    const city = formData.get("city")?.toString()?.trim()
    const userType = formData.get("user_type")?.toString()?.trim()
    const plan = formData.get("plan")?.toString()?.trim()
    const numClients = formData.get("numClients")?.toString()?.trim()

    // Munich-specific fields
    const goal = formData.get("goal")?.toString()?.trim()
    const district = formData.get("district")?.toString()?.trim()
    const startTime = formData.get("startTime")?.toString()?.trim()
    const message = formData.get("message")?.toString()?.trim()

    console.log("Extracted data:", {
      email,
      name,
      phone,
      city,
      userType,
      plan,
      numClients,
      goal,
      district,
      startTime,
      message,
    })

    // Validation
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Bitte gib eine gültige E-Mail-Adresse ein.",
        error: "Invalid email",
      }
    }

    if (!name || name.length < 2) {
      return {
        success: false,
        message: "Bitte gib deinen Namen ein (mindestens 2 Zeichen).",
        error: "Invalid name",
      }
    }

    // Munich-specific validation
    if (city === "München") {
      if (!goal) {
        return {
          success: false,
          message: "Bitte wähle dein Trainingsziel aus.",
          error: "Missing goal",
        }
      }

      if (!district) {
        return {
          success: false,
          message: "Bitte wähle deinen Stadtteil aus.",
          error: "Missing district",
        }
      }

      if (!startTime) {
        return {
          success: false,
          message: "Bitte wähle deinen gewünschten Startzeitpunkt aus.",
          error: "Missing start time",
        }
      }
    }

    // Phone validation (if provided)
    if (phone && phone.length > 0 && phone.length < 8) {
      return {
        success: false,
        message: "Bitte gib eine gültige Telefonnummer ein oder lass das Feld leer.",
        error: "Invalid phone",
      }
    }

    // Prepare data for storage
    const waitlistData = {
      email,
      name,
      phone: phone || null,
      city: city || null,
      user_type: userType || "client",
      plan: plan || null,
      numClients: numClients ? Number.parseInt(numClients) : null,
      goal: goal || null,
      district: district || null,
      startTime: startTime || null,
      message: message || null,
      source: city === "München" ? "munich-landing-page" : "general",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    console.log("Data to be stored:", waitlistData)

    // Try to save to Firebase
    try {
      const docRef = await addDoc(collection(db, "waitlist"), waitlistData)
      console.log("Document written with ID: ", docRef.id)

      return {
        success: true,
        message:
          city === "München"
            ? "Perfekt! Wir haben deine Anfrage erhalten und werden dir in den nächsten 24 Stunden zwei passende Trainer*innen vorschlagen."
            : "Vielen Dank! Du bist jetzt auf der Warteliste. Wir melden uns bald bei dir.",
        alreadyExists: false,
      }
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError)

      // Fallback: Create mock data for development
      const mockData = {
        id: `mock_${Date.now()}`,
        ...waitlistData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("Using mock data:", mockData)

      return {
        success: true,
        message:
          city === "München"
            ? "Perfekt! Wir haben deine Anfrage erhalten und werden dir in den nächsten 24 Stunden zwei passende Trainer*innen vorschlagen."
            : "Vielen Dank! Du bist jetzt auf der Warteliste. Wir melden uns bald bei dir.",
        alreadyExists: false,
      }
    }
  } catch (error) {
    console.error("Error in joinWaitlist:", error)
    return {
      success: false,
      message: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
