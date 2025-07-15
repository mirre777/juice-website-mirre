import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { logger } from "@/lib/logger"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: NextRequest) {
  try {
    const { tempId, paymentIntentId } = await req.json()

    logger.info("Trainer activation request", { tempId, paymentIntentId })

    if (!tempId || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    // Get the temp trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
    }

    const tempTrainerData = tempTrainerSnap.data()

    // Check if already activated
    if (tempTrainerData.status === "active") {
      return NextResponse.json({
        success: true,
        finalId: tempId,
        message: "Trainer already activated",
      })
    }

    // Generate AI content
    const generatedContent = await generateTrainerContent(tempTrainerData)

    // Update trainer to active status
    const updatedData = {
      ...tempTrainerData,
      content: generatedContent,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId: paymentIntentId,
      activatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(tempTrainerRef, updatedData)

    logger.info("Trainer activated successfully", { tempId, paymentIntentId })

    return NextResponse.json({
      success: true,
      finalId: tempId,
      message: "Trainer activated successfully",
    })
  } catch (error) {
    logger.error("Trainer activation failed", {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json({ error: "Activation failed" }, { status: 500 })
  }
}

async function generateTrainerContent(trainerData: any) {
  return {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${trainerData.specialization} • ${trainerData.experience} • ${trainerData.location}`,
      description: `Professional fitness training tailored to your goals. Get the results you've been looking for with personalized coaching and proven methods.`,
    },
    about: {
      title: `About ${trainerData.fullName || trainerData.name}`,
      content: `With ${trainerData.experience} of experience in ${trainerData.specialization}, I'm dedicated to helping you achieve your fitness goals. My approach combines proven training methods with personalized attention to ensure you get the results you deserve.`,
      certifications: trainerData.certifications || ["Certified Personal Trainer", "Nutrition Specialist"],
    },
    services: [
      {
        name: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "From €60/session",
      },
      {
        name: "Group Classes",
        description: "Small group training sessions for motivation and community support.",
        price: "From €25/session",
      },
      {
        name: "Online Coaching",
        description: "Remote coaching with custom workout plans and nutrition guidance.",
        price: "From €150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Professional, knowledgeable, and motivating.",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Best trainer I've worked with. Really understands how to push you to achieve your goals.",
        rating: 5,
      },
      {
        name: "Lisa K.",
        text: "Transformed my approach to fitness. Highly recommend!",
        rating: 5,
      },
    ],
    contact: {
      email: trainerData.email,
      phone: trainerData.phone || "",
      location: trainerData.location,
      availability: "Monday - Friday: 6AM - 8PM, Saturday: 8AM - 4PM",
    },
  }
}
