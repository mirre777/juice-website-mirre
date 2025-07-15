import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log("Webhook event received:", event.type)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment succeeded:", paymentIntent.id)

        // Check if this is a trainer activation payment
        if (paymentIntent.metadata?.tempId && paymentIntent.metadata?.type === "trainer_activation") {
          console.log("Processing trainer activation for tempId:", paymentIntent.metadata.tempId)
          await activateTrainer(paymentIntent.metadata.tempId, paymentIntent.id)
        }
        break

      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function activateTrainer(tempId: string, paymentIntentId: string) {
  try {
    console.log("Activating trainer:", { tempId, paymentIntentId })

    // Get the temp trainer data
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

    if (!tempTrainerSnap.exists()) {
      throw new Error(`Temp trainer not found: ${tempId}`)
    }

    const tempTrainerData = tempTrainerSnap.data()
    console.log("Temp trainer data:", tempTrainerData)

    // Generate AI content for the trainer
    const generatedContent = await generateTrainerContent(tempTrainerData)

    // Create the final trainer document
    const finalTrainerId = `trainer_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const finalTrainerRef = doc(db, "trainers", finalTrainerId)

    const finalTrainerData = {
      ...tempTrainerData,
      id: finalTrainerId,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId: paymentIntentId,
      activatedAt: new Date().toISOString(),
      content: generatedContent,
      // Remove temp-specific fields
      sessionToken: null,
      expiresAt: null,
    }

    await setDoc(finalTrainerRef, finalTrainerData)
    console.log("Final trainer created:", finalTrainerId)

    // Update the temp trainer to mark as activated
    await updateDoc(tempTrainerRef, {
      status: "activated",
      finalId: finalTrainerId,
      activatedAt: new Date().toISOString(),
    })

    console.log("Trainer activation completed successfully")
  } catch (error) {
    console.error("Trainer activation failed:", error)
    throw error
  }
}

async function generateTrainerContent(trainerData: any) {
  const { name, fullName, specialization, experience, location, bio } = trainerData

  return {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialization} • ${experience} • ${location}`,
      cta: "Book Your Free Consultation",
    },
    about: {
      title: `About ${fullName || name}`,
      content:
        bio ||
        `Professional ${specialization.toLowerCase()} with ${experience} of experience helping clients achieve their fitness goals in ${location}.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one training sessions tailored to your specific goals and fitness level.",
        price: "€80/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for motivation and community support.",
        price: "€25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with personalized workout plans and nutrition guidance.",
        price: "€150/month",
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
        text: "Best trainer I've worked with. Really understands how to push you safely.",
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
