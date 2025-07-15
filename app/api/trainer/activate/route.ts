import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await req.json()

    console.log("Activation request:", { tempId, paymentIntentId })

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get the temp trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerSnap.data()

    // Check if already activated
    if (tempTrainerData.status === "activated" || tempTrainerData.finalId) {
      return NextResponse.json({
        success: true,
        finalId: tempTrainerData.finalId,
        message: "Trainer already activated",
      })
    }

    // Generate content and create final trainer
    const generatedContent = generateTrainerContent(tempTrainerData)
    const finalTrainerId = `trainer_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const finalTrainerData = {
      ...tempTrainerData,
      id: finalTrainerId,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,
      activatedAt: new Date().toISOString(),
      content: generatedContent,
      sessionToken: null,
      expiresAt: null,
    }

    // Create final trainer document
    const finalTrainerRef = doc(db, "trainers", finalTrainerId)
    await setDoc(finalTrainerRef, finalTrainerData)

    // Update temp trainer
    await updateDoc(tempTrainerRef, {
      status: "activated",
      finalId: finalTrainerId,
      activatedAt: new Date().toISOString(),
    })

    console.log("Trainer activated successfully:", finalTrainerId)

    return NextResponse.json({
      success: true,
      finalId: finalTrainerId,
      message: "Trainer activated successfully",
    })
  } catch (error) {
    console.error("Activation error:", error)
    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}

function generateTrainerContent(trainerData: any) {
  const { name, fullName, specialization, experience, location, bio } = trainerData

  return {
    hero: {
      title: "Transform Your Body, Transform Your Life",
      subtitle: `${specialization} • ${experience} • ${location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${fullName || name}`,
      content: bio || `Professional ${specialization.toLowerCase()} with ${experience} of experience.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one sessions tailored to your goals.",
        price: "€80/session",
      },
      {
        title: "Group Classes",
        description: "Small group training for motivation.",
        price: "€25/session",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months!",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "Contact for details",
      location: location,
    },
  }
}
