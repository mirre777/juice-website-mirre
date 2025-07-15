import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await req.json()

    logger.info("Trainer activation API called", { tempId, paymentIntentId })

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Get the temporary trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      logger.error("Temporary trainer not found", { tempId })
      return NextResponse.json({ success: false, error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerSnap.data()

    // Generate AI content for the trainer
    const content = await generateTrainerContent(tempTrainerData)

    // Create the final trainer document
    const finalTrainerData = {
      ...tempTrainerData,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,
      content,
      activatedAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to the trainers collection with the same ID
    await setDoc(tempTrainerRef, finalTrainerData)

    logger.info("Trainer activated successfully", {
      tempId,
      paymentIntentId,
      finalId: tempId,
    })

    return NextResponse.json({
      success: true,
      finalId: tempId,
      message: "Trainer activated successfully",
    })
  } catch (error) {
    logger.error("Trainer activation failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Activation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function generateTrainerContent(trainerData: any) {
  const { fullName, specialty, experience, bio, location } = trainerData

  // Generate comprehensive content for the trainer
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialty} • ${experience} • ${location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${fullName}`,
      content:
        bio || `Passionate fitness professional dedicated to helping clients achieve their goals through ${specialty}.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "From €60/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for a more social and cost-effective approach.",
        price: "From €25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with personalized workout plans and nutrition guidance.",
        price: "From €40/session",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Highly recommend.",
        rating: 5,
      },
      {
        name: "John D.",
        text: "Professional, knowledgeable, and motivating trainer.",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone,
      location: location,
    },
    seo: {
      title: `${fullName} - ${specialty} in ${location}`,
      description: `Professional ${specialty} in ${location}. ${experience} of experience helping clients achieve their fitness goals.`,
      keywords: [specialty.toLowerCase(), "personal trainer", location.toLowerCase(), "fitness", "coaching"],
    },
  }

  return content
}
