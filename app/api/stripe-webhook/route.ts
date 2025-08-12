import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 10)

  console.log("=== WEBHOOK PROCESSING (SIGNATURE VERIFICATION ENABLED) ===", {
    debugId,
    timestamp: new Date().toISOString(),
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  })

  try {
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

    let event: Stripe.Event
    try {
      // Trim webhook secret to remove any whitespace
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!.trim()

      console.log("=== SIGNATURE VERIFICATION ATTEMPT ===", {
        debugId,
        webhookSecretLength: webhookSecret.length,
        webhookSecretPrefix: webhookSecret.substring(0, 10),
        signaturePrefix: signature.substring(0, 20),
      })

      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

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
        const session = event.data.object as Stripe.Checkout.Session
        console.log("✅ Processing checkout.session.completed", {
          debugId,
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          clientReferenceId: session.client_reference_id,
        })

        // TODO: Add your subscription processing logic here
        // - Update user subscription status
        // - Send confirmation emails
        // - Update database records

        break

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription
        console.log("✅ Processing customer.subscription.created", {
          debugId,
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        })
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log("✅ Processing customer.subscription.updated", {
          debugId,
          subscriptionId: updatedSubscription.id,
          status: updatedSubscription.status,
        })
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
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
