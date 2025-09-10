/**
 * CRITICAL: Read docs/FIREBASE_BUILD_ISSUES.md before modifying this file!
 * This file contains Firebase Admin SDK usage that MUST be properly guarded against build-time initialization.
 */

import { type NextRequest, NextResponse } from "next/server"

let stripe: any = null

async function getStripe() {
  if (!stripe) {
    const Stripe = (await import("stripe")).default
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
  }
  return stripe
}

let db: any = null

async function getFirebaseDb() {
  if (!db) {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    }
    db = getFirestore()
  }
  return db
}

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 10)

  console.log("=== WEBHOOK PROCESSING (SIGNATURE VERIFICATION ENABLED) ===", {
    debugId,
    timestamp: new Date().toISOString(),
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  })

  try {
    const stripeInstance = await getStripe()

    const rawBody = await request.text()
    const signature = request.headers.get("stripe-signature")

    console.log("=== DETAILED REQUEST DEBUG ===", {
      debugId,
      hasSignature: !!signature,
      signatureLength: signature?.length,
      bodyLength: rawBody.length,
      bodyFirstChars: rawBody.substring(0, 100),
      contentType: request.headers.get("content-type"),
      userAgent: request.headers.get("user-agent"),
    })

    if (!signature) {
      console.error("Missing Stripe signature header", { debugId })
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
    }

    let event: any
    try {
      // Trim webhook secret to remove any whitespace
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!.trim()

      console.log("=== SIGNATURE VERIFICATION ATTEMPT ===", {
        debugId,
        webhookSecretLength: webhookSecret.length,
        webhookSecretPrefix: webhookSecret.substring(0, 10),
        signaturePrefix: signature.substring(0, 20),
      })

      event = stripeInstance.webhooks.constructEvent(rawBody, signature, webhookSecret)

      console.log("✅ SIGNATURE VERIFICATION SUCCESSFUL", {
        debugId,
        eventId: event.id,
        eventType: event.type,
      })
    } catch (err: any) {
      console.error("=== SIGNATURE VERIFICATION FAILED ===", {
        debugId,
        error: err.message,
        webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
        webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length,
        signatureExists: !!signature,
        bodyLength: rawBody.length,
        errorType: err.constructor.name,
      })
      return NextResponse.json(
        {
          error: `Webhook signature verification failed: ${err.message}`,
          debugId,
        },
        { status: 400 },
      )
    }

    console.log("Processing webhook event", {
      debugId,
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode,
    })

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any // Using any type to avoid Stripe import issues
        console.log("✅ Processing checkout.session.completed", {
          debugId,
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          clientReferenceId: session.client_reference_id,
        })

        if (session.client_reference_id && session.subscription) {
          try {
            const userId = session.client_reference_id

            const firebaseDb = await getFirebaseDb()
            const userRef = firebaseDb.collection("users").doc(userId)
            await userRef.set(
              {
                subscriptionId: session.subscription,
                customerId: session.customer,
                subscriptionStatus: "active",
                isPremium: true,
                isActive: true,
                activatedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            )

            console.log("✅ User subscription activated", {
              debugId,
              userId,
              subscriptionId: session.subscription,
            })
          } catch (error: any) {
            console.error("❌ Failed to activate user subscription", {
              debugId,
              error: error.message,
              userId: session.client_reference_id,
            })
          }
        }

        if (session.client_reference_id && session.client_reference_id.startsWith("temp_")) {
          try {
            const trainerId = session.client_reference_id

            const firebaseDb = await getFirebaseDb()
            const trainerRef = firebaseDb.collection("trainers").doc(trainerId)
            await trainerRef.set(
              {
                status: "active",
                isActive: true,
                isPaid: true,
                customerId: session.customer,
                subscriptionId: session.subscription,
                activatedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            )

            console.log("✅ Trainer profile activated", {
              debugId,
              trainerId,
              subscriptionId: session.subscription,
            })
          } catch (error: any) {
            console.error("❌ Failed to activate trainer profile", {
              debugId,
              error: error.message,
              trainerId: session.client_reference_id,
            })
          }
        }

        break

      case "customer.subscription.created":
        const subscription = event.data.object as any // Using any type to avoid Stripe import issues
        console.log("✅ Processing customer.subscription.created", {
          debugId,
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        })

        try {
          // Find user by customer ID and update subscription status
          const firebaseDb = await getFirebaseDb()
          const usersQuery = await firebaseDb.collection("users").where("customerId", "==", subscription.customer).get()

          if (!usersQuery.empty) {
            const userDoc = usersQuery.docs[0]
            await userDoc.ref.set(
              {
                subscriptionId: subscription.id,
                subscriptionStatus: subscription.status,
                isPremium: subscription.status === "active",
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            )

            console.log("✅ Subscription status updated", {
              debugId,
              userId: userDoc.id,
              subscriptionStatus: subscription.status,
            })
          }
        } catch (error: any) {
          console.error("❌ Failed to update subscription status", {
            debugId,
            error: error.message,
            customerId: subscription.customer,
          })
        }
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as any // Using any type to avoid Stripe import issues
        console.log("✅ Processing customer.subscription.updated", {
          debugId,
          subscriptionId: updatedSubscription.id,
          status: updatedSubscription.status,
        })

        try {
          const firebaseDb = await getFirebaseDb()
          const usersQuery = await firebaseDb
            .collection("users")
            .where("subscriptionId", "==", updatedSubscription.id)
            .get()

          if (!usersQuery.empty) {
            const userDoc = usersQuery.docs[0]
            await userDoc.ref.set(
              {
                subscriptionStatus: updatedSubscription.status,
                isPremium: updatedSubscription.status === "active",
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            )

            console.log("✅ Subscription status updated", {
              debugId,
              userId: userDoc.id,
              newStatus: updatedSubscription.status,
            })
          }
        } catch (error: any) {
          console.error("❌ Failed to update subscription", {
            debugId,
            error: error.message,
            subscriptionId: updatedSubscription.id,
          })
        }
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as any // Using any type to avoid Stripe import issues
        console.log("✅ Processing invoice.payment_succeeded", {
          debugId,
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          amountPaid: invoice.amount_paid,
        })
        break

      default:
        console.log("Unhandled event type", {
          debugId,
          eventType: event.type,
        })
    }

    return NextResponse.json({
      success: true,
      debugId,
      eventType: event.type,
      eventId: event.id,
      message: "✅ Webhook processed successfully with signature verification",
    })
  } catch (error: any) {
    console.error("Webhook processing error", {
      debugId,
      errorMessage: error.message,
      errorStack: error.stack,
    })

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        debugId,
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Stripe webhook endpoint is reachable",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}
