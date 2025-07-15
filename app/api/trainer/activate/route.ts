import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"

export async function POST(req: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await req.json()

    if (!tempId) {
      return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 })
    }

    console.log("Activating trainer:", { tempId, paymentIntentId })

    // Get the temp trainer document
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerDoc = await getDoc(tempTrainerRef)

    if (!tempTrainerDoc.exists()) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerDoc.data()

    // Generate content for the trainer
    const generatedContent = {
      hero: {
        title: "Transform Your Body, Transform Your Life",
        subtitle: `${tempTrainerData.specialty || "Fitness Specialist"} • ${tempTrainerData.experience || "Professional"} • ${tempTrainerData.location || "Available"}`,
        cta: "Book Your Free Consultation",
      },
      about: {
        title: `About ${tempTrainerData.fullName || "Your Trainer"}`,
        content:
          tempTrainerData.bio ||
          "Dedicated fitness professional committed to helping you achieve your goals through personalized training and nutrition guidance.",
      },
      services: tempTrainerData.services || [
        {
          name: "Personal Training",
          description: "One-on-one training sessions tailored to your goals",
        },
        {
          name: "Nutrition Coaching",
          description: "Personalized meal plans and nutrition guidance",
        },
      ],
      contact: {
        email: tempTrainerData.email,
        phone: tempTrainerData.phone,
        location: tempTrainerData.location,
      },
      testimonials: [
        {
          name: "Sarah M.",
          text: "Amazing results! Highly recommend this trainer.",
          rating: 5,
        },
        {
          name: "John D.",
          text: "Professional, knowledgeable, and motivating.",
          rating: 5,
        },
      ],
    }

    // Update the trainer document
    await updateDoc(tempTrainerRef, {
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId: paymentIntentId || null,
      activatedAt: new Date().toISOString(),
      content: generatedContent,
    })

    console.log("Trainer activated successfully:", tempId)

    return NextResponse.json({
      success: true,
      message: "Trainer activated successfully",
      trainerId: tempId,
    })
  } catch (error) {
    console.error("Error activating trainer:", error)
    return NextResponse.json({ error: "Failed to activate trainer" }, { status: 500 })
  }
}
