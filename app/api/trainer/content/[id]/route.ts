import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainerId = params.id
    console.log("Fetching trainer content for:", trainerId)

    // Get trainer document
    const trainerRef = doc(db, "trainers", trainerId)
    const trainerSnap = await getDoc(trainerRef)

    if (!trainerSnap.exists()) {
      console.log("Trainer not found:", trainerId)
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const trainerData = trainerSnap.data()
    console.log("Trainer data retrieved:", {
      id: trainerId,
      status: trainerData.status,
      isActive: trainerData.isActive,
    })

    // Check if trainer is active
    if (!trainerData.isActive || trainerData.status !== "active") {
      console.log("Trainer not active:", {
        isActive: trainerData.isActive,
        status: trainerData.status,
      })
      return NextResponse.json({ error: "Trainer profile not active" }, { status: 403 })
    }

    // Return trainer data with generated content
    return NextResponse.json({
      success: true,
      trainer: {
        id: trainerId,
        name: trainerData.name,
        fullName: trainerData.fullName,
        email: trainerData.email,
        specialization: trainerData.specialization,
        experience: trainerData.experience,
        location: trainerData.location,
        bio: trainerData.bio,
        content: trainerData.content || generateDefaultContent(trainerData),
        isActive: trainerData.isActive,
        status: trainerData.status,
      },
    })
  } catch (error) {
    console.error("Error fetching trainer content:", error)
    return NextResponse.json({ error: "Failed to fetch trainer content" }, { status: 500 })
  }
}

function generateDefaultContent(trainerData: any) {
  return {
    hero: {
      title: "Transform Your Body, Transform Your Life",
      subtitle: `${trainerData.specialization} • ${trainerData.experience} • ${trainerData.location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${trainerData.fullName || trainerData.name}`,
      content: trainerData.bio || "Professional fitness trainer dedicated to helping you achieve your goals.",
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions.",
        price: "€80/session",
      },
    ],
    testimonials: [
      {
        name: "Client",
        text: "Great trainer!",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "",
      location: trainerData.location,
    },
  }
}
