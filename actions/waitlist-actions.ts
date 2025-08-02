"use server"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase"

export interface WaitlistFormData {
  name?: string
  email: string
  user_type: "client" | "trainer"
  city?: string
  district?: string
  goal?: string
  startTime?: string
  phone?: string
  message?: string
  numClients?: string
  plan?: string
  source?: string
}

export async function joinWaitlist(formData: FormData) {
  try {
    // Extract all form fields
    const data: WaitlistFormData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      user_type: (formData.get("user_type")?.toString() as "client" | "trainer") || "client",
      city: formData.get("city")?.toString() || "",
      district: formData.get("district")?.toString() || "",
      goal: formData.get("goal")?.toString() || "",
      startTime: formData.get("startTime")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      numClients: formData.get("numClients")?.toString() || "",
      plan: formData.get("plan")?.toString() || "",
    }

    // Determine source based on city and form data
    if (data.city === "München") {
      data.source = "munich-landing-page"
    } else if (data.user_type === "trainer") {
      data.source = "trainer-signup"
    } else {
      data.source = "general-waitlist"
    }

    // Validation
    if (!data.email || !data.email.includes("@")) {
      return {
        success: false,
        message: "Bitte gib eine gültige E-Mail-Adresse ein.",
      }
    }

    if (data.user_type === "client") {
      if (!data.name || data.name.trim().length < 2) {
        return {
          success: false,
          message: "Bitte gib deinen Namen ein (mindestens 2 Zeichen).",
        }
      }

      if (data.city === "München") {
        if (!data.goal) {
          return {
            success: false,
            message: "Bitte wähle dein Trainingsziel aus.",
          }
        }
        if (!data.district) {
          return {
            success: false,
            message: "Bitte wähle deinen Stadtteil aus.",
          }
        }
        if (!data.startTime) {
          return {
            success: false,
            message: "Bitte wähle deinen gewünschten Startzeitpunkt aus.",
          }
        }
      }
    }

    // Phone validation (if provided)
    if (data.phone && data.phone.length > 0 && data.phone.length < 8) {
      return {
        success: false,
        message: "Bitte gib eine gültige Telefonnummer ein oder lass das Feld leer.",
      }
    }

    // Save to Firebase
    const docData = {
      ...data,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "waitlist"), docData)

    console.log("Waitlist entry created:", docRef.id, docData)

    return {
      success: true,
      message:
        data.user_type === "client"
          ? "Perfekt! Wir melden uns in den nächsten 24 Stunden bei dir mit passenden Trainer-Vorschlägen."
          : "Vielen Dank für deine Anmeldung! Wir melden uns bald bei dir.",
    }
  } catch (error) {
    console.error("Error adding to waitlist:", error)
    return {
      success: false,
      message: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    }
  }
}
