import { type NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import Stripe from "stripe"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  const userAgent = request.headers.get("user-agent") || "unknown"
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

  logger.info("Trainer activation request started", {
    requestId,
    userAgent,
    ipAddress,
  })

  try {
    const body = await request.json()
    const { tempId, paymentIntentId } = body

    logger.info("Trainer activation initiated", {
      tempId,
      paymentIntentId,
      timestamp: new Date().toISOString(),
    })

    if (!tempId || !paymentIntentId) {
      logger.warn("Missing required fields for activation", {
        tempId: !!tempId,
        paymentIntentId: !!paymentIntentId,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Verify payment with Stripe
    logger.info("Verifying payment with Stripe", {
      paymentIntentId,
      tempId,
    })

    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (stripeError) {
      logger.error("Stripe payment verification failed", {
        tempId,
        paymentIntentId,
        error: stripeError instanceof Error ? stripeError.message : String(stripeError),
      })

      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
        },
        { status: 400 },
      )
    }

    if (paymentIntent.status !== "succeeded") {
      logger.warn("Payment not successful", {
        tempId,
        paymentIntentId,
        status: paymentIntent.status,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Payment not completed",
        },
        { status: 400 },
      )
    }

    if (paymentIntent.amount !== 2900) {
      // €29.00 in cents
      logger.error("Payment amount mismatch", {
        tempId,
        paymentIntentId,
        expectedAmount: 2900,
        actualAmount: paymentIntent.amount,
      })

      return NextResponse.json(
        {
          success: false,
          error: "Payment amount incorrect",
        },
        { status: 400 },
      )
    }

    logger.info("Payment verified successfully", {
      tempId,
      paymentIntentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })

    // Get temp trainer document
    let tempTrainerRef, tempTrainerSnap, tempTrainerData
    try {
      tempTrainerRef = doc(db, "trainers", tempId)
      tempTrainerSnap = await getDoc(tempTrainerRef)

      if (!tempTrainerSnap.exists()) {
        logger.error("Temp trainer not found during activation", {
          tempId,
          paymentIntentId,
        })

        return NextResponse.json(
          {
            success: false,
            error: "Trainer profile not found",
          },
          { status: 404 },
        )
      }

      tempTrainerData = tempTrainerSnap.data()
    } catch (firebaseError) {
      logger.error("Firebase error fetching temp trainer", {
        tempId,
        paymentIntentId,
        error: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
      })

      return NextResponse.json(
        {
          success: false,
          error: "Database error",
        },
        { status: 500 },
      )
    }

    // Check if already activated
    if (tempTrainerData.isActive && tempTrainerData.isPaid) {
      logger.info("Trainer already activated", {
        tempId,
        finalId: tempTrainerData.finalId,
      })

      return NextResponse.json({
        success: true,
        finalId: tempTrainerData.finalId,
        redirectUrl: `/marketplace/trainer/${tempTrainerData.finalId}`,
      })
    }

    // Generate AI content for permanent profile
    const generatedContent = generateTrainerContent(tempTrainerData)

    // Create final trainer profile with generated content
    const finalTrainerData = {
      // Basic trainer info
      fullName: tempTrainerData.fullName,
      name: tempTrainerData.fullName, // Ensure both fields exist
      email: tempTrainerData.email,
      phone: tempTrainerData.phone,
      location: tempTrainerData.location,
      specialty: tempTrainerData.specialty,
      specialization: tempTrainerData.specialty, // Ensure both fields exist
      experience: tempTrainerData.experience,
      bio: tempTrainerData.bio,
      certifications: tempTrainerData.certifications || [],

      // Status and payment info
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,

      // Add generated content
      content: generatedContent,

      // Timestamps
      createdAt: tempTrainerData.createdAt,
      activatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    logger.info("Creating final trainer profile with generated content", {
      tempId,
      email: tempTrainerData.email,
      specialty: tempTrainerData.specialty,
      hasContent: !!generatedContent,
      contentSections: Object.keys(generatedContent),
    })

    // Add final trainer document
    let finalTrainerRef, finalId
    try {
      finalTrainerRef = await addDoc(collection(db, "trainers"), finalTrainerData)
      finalId = finalTrainerRef.id

      // Update temp document with final ID
      await updateDoc(tempTrainerRef, {
        finalId,
        isActive: true,
        isPaid: true,
        paymentIntentId,
        activatedAt: serverTimestamp(),
      })
    } catch (firebaseError) {
      logger.error("Firebase error creating final trainer", {
        tempId,
        paymentIntentId,
        error: firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
      })

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create trainer profile",
        },
        { status: 500 },
      )
    }

    logger.info("Trainer activation completed successfully", {
      tempId,
      finalId,
      email: tempTrainerData.email,
      paymentIntentId,
      contentGenerated: true,
    })

    return NextResponse.json({
      success: true,
      finalId,
      redirectUrl: `/marketplace/trainer/${finalId}`,
    })
  } catch (error) {
    const processingTime = Date.now() - startTime

    logger.error("Trainer activation error", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      processingTime,
    })

    return NextResponse.json(
      {
        success: false,
        error: "Activation failed. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Content generation function
function generateTrainerContent(trainerData: any) {
  const name = trainerData.fullName || trainerData.name
  const specialty = trainerData.specialty || trainerData.specialization
  const location = trainerData.location
  const experience = trainerData.experience
  const bio = trainerData.bio

  return {
    hero: {
      title: `Transform Your Fitness with ${name}`,
      subtitle: `Professional ${specialty} Training • ${experience} Experience`,
      description: `Welcome! I'm ${name}, a certified personal trainer specializing in ${specialty}. With ${experience} of experience in ${location}, I'm here to help you achieve your fitness goals through personalized training programs that deliver real results.`,
    },
    about: {
      title: "About Me",
      content:
        bio ||
        `I'm ${name}, a passionate fitness professional with ${experience} of experience in ${specialty}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.\n\nMy approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.\n\nI'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`,
    },
    services: [
      {
        id: "1",
        title: "Personal Training Session",
        description: `One-on-one personalized ${specialty.toLowerCase()} training session focused on your specific goals`,
        price: 60,
        duration: "60 minutes",
        featured: true,
      },
      {
        id: "2",
        title: "Fitness Assessment",
        description: "Comprehensive fitness evaluation and goal-setting session",
        price: 40,
        duration: "45 minutes",
        featured: false,
      },
      {
        id: "3",
        title: "Custom Workout Plan",
        description: `Personalized ${specialty.toLowerCase()} program designed for your goals and schedule`,
        price: 80,
        duration: "Digital delivery",
        featured: false,
      },
    ],
    contact: {
      title: "Let's Start Your Fitness Journey",
      description: `Ready to transform your fitness with professional ${specialty.toLowerCase()} training? Get in touch to schedule your first session or ask any questions.`,
      email: trainerData.email,
      phone: trainerData.phone || "",
      location: location,
    },
    seo: {
      title: `${name} - Personal Trainer in ${location}`,
      description: `Professional ${specialty} training with ${name}. Transform your fitness with personalized programs in ${location}. ${experience} of experience.`,
    },
    version: 1,
    lastModified: new Date().toISOString(),
  }
}
