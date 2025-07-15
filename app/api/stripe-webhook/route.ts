import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  }

  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

const db = getFirestore()

async function generateTrainerContent(trainerData: any) {
  const { name, fullName, specialization, location, experience, bio } = trainerData

  // Generate AI content for the trainer
  const content = {
    hero: {
      title: `Transform Your Body, Transform Your Life`,
      subtitle: `${specialization} • ${experience} • ${location}`,
      description: `Professional fitness coaching tailored to your goals. Start your transformation journey today with personalized training programs.`,
    },
    about: {
      title: `About ${fullName || name}`,
      content:
        bio ||
        `${fullName || name} is a dedicated ${specialization} with ${experience} of experience helping clients achieve their fitness goals. Based in ${location}, they provide personalized training programs designed to deliver real results.`,
    },
    services: [
      {
        title: "Personal Training",
        description: "One-on-one coaching sessions tailored to your specific goals and fitness level.",
        price: "From €60/session",
      },
      {
        title: "Group Classes",
        description: "Small group training sessions for motivation and community support.",
        price: "From €25/session",
      },
      {
        title: "Online Coaching",
        description: "Remote coaching with personalized workout plans and nutrition guidance.",
        price: "From €150/month",
      },
    ],
    testimonials: [
      {
        name: "Sarah M.",
        text: "Amazing results in just 3 months! Professional, knowledgeable, and truly cares about your progress.",
        rating: 5,
      },
      {
        name: "Mike R.",
        text: "Best investment I've made for my health. The personalized approach really makes a difference.",
        rating: 5,
      },
      {
        name: "Lisa K.",
        text: "Incredible transformation both physically and mentally. Highly recommend!",
        rating: 5,
      },
    ],
    contact: {
      phone: "+43 123 456 789",
      email: `${(fullName || name).toLowerCase().replace(/\s+/g, ".")}@example.com`,
      location: location,
      availability: "Monday - Saturday: 6:00 AM - 8:00 PM",
    },
  }

  return content
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  console.log("Webhook event received:", event.type)

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log("Payment succeeded:", paymentIntent.id)

    // Check if this is a trainer activation payment
    const tempId = paymentIntent.metadata?.tempId
    if (tempId) {
      console.log("Activating trainer with tempId:", tempId)

      try {
        // Get the temp trainer data
        const tempTrainerRef = db.collection("trainers").doc(tempId)
        const tempTrainerDoc = await tempTrainerRef.get()

        if (!tempTrainerDoc.exists) {
          console.error("Temp trainer not found:", tempId)
          return NextResponse.json({ error: "Trainer not found" }, { status: 404 })
        }

        const tempTrainerData = tempTrainerDoc.data()!
        console.log("Found temp trainer:", tempTrainerData.name)

        // Generate AI content
        const generatedContent = await generateTrainerContent(tempTrainerData)

        // Create the final trainer document
        const finalTrainerRef = db.collection("trainers").doc()
        const finalTrainerId = finalTrainerRef.id

        const finalTrainerData = {
          ...tempTrainerData,
          id: finalTrainerId,
          status: "active",
          isActive: true,
          isPaid: true,
          paymentIntentId: paymentIntent.id,
          content: generatedContent,
          activatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Save the final trainer
        await finalTrainerRef.set(finalTrainerData)

        // Delete the temp trainer
        await tempTrainerRef.delete()

        console.log("Trainer activated successfully:", finalTrainerId)

        return NextResponse.json({
          success: true,
          message: "Trainer activated successfully",
          trainerId: finalTrainerId,
        })
      } catch (error) {
        console.error("Error activating trainer:", error)
        return NextResponse.json({ error: "Failed to activate trainer" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
