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

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

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
    const tempTrainerRef = doc(db, "trainers", tempId)
    const tempTrainerSnap = await getDoc(tempTrainerRef)

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

    const tempTrainerData = tempTrainerSnap.data()

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

    // Create final trainer profile
    const finalTrainerData = {
      ...tempTrainerData,
      status: "active",
      isActive: true,
      isPaid: true,
      paymentIntentId,
      activatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Remove temp-specific fields
    delete finalTrainerData.sessionToken
    delete finalTrainerData.expiresAt

    logger.info("Creating final trainer profile", {
      tempId,
      email: tempTrainerData.email,
      specialty: tempTrainerData.specialty,
    })

    // Add final trainer document
    const finalTrainerRef = await addDoc(collection(db, "trainers"), finalTrainerData)
    const finalId = finalTrainerRef.id

    // Update temp document with final ID
    await updateDoc(tempTrainerRef, {
      finalId,
      isActive: true,
      isPaid: true,
      paymentIntentId,
      activatedAt: serverTimestamp(),
    })

    logger.info("Trainer activation completed successfully", {
      tempId,
      finalId,
      email: tempTrainerData.email,
      paymentIntentId,
    })

    return NextResponse.json({
      success: true,
      finalId,
      redirectUrl: `/marketplace/trainer/${finalId}`,
    })
  } catch (error) {
    const processingTime = Date.now() - startTime

    logger.error("Trainer activation error", {
      tempId: request.body?.tempId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: "Activation failed. Please try again.",
      },
      { status: 500 },
    )
  }
}
