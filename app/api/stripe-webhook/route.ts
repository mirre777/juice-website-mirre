import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
})

// Your webhook secret from the Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

// Simple in-memory cache for processed events (in production, use a database)
const processedEvents = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Log the received event
    console.log(`Webhook received: ${event.type} | ID: ${event.id}`)

    // Check for idempotency - have we processed this event before?
    if (processedEvents.has(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`)
      return NextResponse.json({ received: true, status: "already_processed" })
    }

    // Handle specific event types
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
          break

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
          break

        case "customer.subscription.created":
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break

        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
          break

        // Add more event handlers as needed

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      // Mark this event as processed
      processedEvents.add(event.id)

      // In a production environment, you would store this in a database
      // await db.processedEvents.create({ data: { eventId: event.id } })

      console.log(`Successfully processed event: ${event.type} | ID: ${event.id}`)

      // Return a 200 response to acknowledge receipt of the event
      return NextResponse.json({ received: true, status: "processed" })
    } catch (error: any) {
      console.error(`Error processing webhook event ${event.id}: ${error.message}`)
      console.error(error.stack)

      // For most errors, we'll still return 200 to acknowledge receipt
      // This prevents Stripe from retrying events that will always fail
      return NextResponse.json({ received: true, status: "error", message: error.message }, { status: 200 })
    }
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

// Handler for successful payment intents
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment succeeded:", paymentIntent.id)

    // Check if we've already processed this payment (idempotency check)
    // In production, you would check your database
    // const existingPayment = await db.payments.findUnique({
    //   where: { paymentIntentId: paymentIntent.id }
    // })
    // if (existingPayment) {
    //   console.log(`Payment ${paymentIntent.id} already recorded, skipping`)
    //   return
    // }

    // Extract customer information
    const customerId = paymentIntent.customer as string
    const amount = paymentIntent.amount
    const email = paymentIntent.receipt_email
    const metadata = paymentIntent.metadata

    // Extract plan information from metadata
    const planId = metadata.plan || "unknown"
    const planType = metadata.planType || "Unknown Plan"
    const userEmail = metadata.userEmail || email || "unknown" // Use metadata email, fallback to receipt_email

    // Log detailed information
    console.log({
      event: "payment_succeeded",
      paymentId: paymentIntent.id,
      customerId,
      amount,
      email: userEmail, // Use the extracted email
      metadata,
      plan: planId,
      planType: planType,
      status: "succeeded",
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    })

    // TODO: When Firebase is connected, store this information
    // For now, we'll log it
    /*
    await db.payments.create({
      data: {
        paymentIntentId: paymentIntent.id,
        customerId,
        amount,
        email,
        metadata,
        plan: planId,
        planType: planType,
        status: 'succeeded',
        createdAt: new Date(paymentIntent.created * 1000),
      }
    })

    // Update user subscription status
    if (customerId) {
      await db.users.update({
        where: { customerId },
        data: {
          isPremium: true,
          plan: planId,
          subscriptionStatus: 'active',
          subscriptionUpdatedAt: new Date(),
        }
      })
    }
    */
  } catch (error) {
    console.error("Error handling payment intent success:", error)
    throw error
  }
}

// NEW: Handler for failed payment intents
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id)

    // Extract information
    const customerId = paymentIntent.customer as string
    const amount = paymentIntent.amount
    const email = paymentIntent.receipt_email
    const lastError = paymentIntent.last_payment_error

    // Log detailed information about the failure
    console.log({
      event: "payment_failed",
      paymentId: paymentIntent.id,
      customerId,
      amount,
      email,
      errorMessage: lastError ? lastError.message : "Unknown error",
      errorCode: lastError ? lastError.code : null,
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    })

    // TODO: When Firebase is connected, store this information
    /*
    await db.paymentFailures.create({
      data: {
        paymentIntentId: paymentIntent.id,
        customerId,
        amount,
        email,
        errorMessage: lastError ? lastError.message : "Unknown error",
        errorCode: lastError ? lastError.code : null,
        createdAt: new Date(paymentIntent.created * 1000),
      }
    })

    // You might want to notify the user or your support team
    if (email) {
      await sendPaymentFailureEmail(email, {
        amount: formatAmount(amount, paymentIntent.currency),
        reason: lastError ? lastError.message : "Unknown error",
      })
    }
    */
  } catch (error) {
    console.error("Error handling payment intent failure:", error)
    throw error
  }
}

// NEW: Handler for subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log("Subscription created:", subscription.id)

    // Extract information
    const customerId = subscription.customer as string
    const status = subscription.status
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    const items = subscription.items.data

    // Get the product and price details from the first item
    const productId = items[0]?.price.product as string
    const priceId = items[0]?.price.id
    const amount = items[0]?.price.unit_amount

    // Log detailed information
    console.log({
      event: "subscription_created",
      subscriptionId: subscription.id,
      customerId,
      status,
      productId,
      priceId,
      amount,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      createdAt: new Date(subscription.created * 1000).toISOString(),
    })

    // TODO: When Firebase is connected, store this information
    /*
    await db.subscriptions.create({
      data: {
        subscriptionId: subscription.id,
        customerId,
        status,
        productId,
        priceId,
        amount,
        currentPeriodEnd,
        createdAt: new Date(subscription.created * 1000),
      }
    })

    // Update user subscription status
    await db.users.update({
      where: { customerId },
      data: {
        isPremium: true,
        subscriptionStatus: status,
        subscriptionId: subscription.id,
        subscriptionUpdatedAt: new Date(),
        subscriptionExpiresAt: currentPeriodEnd,
      }
    })

    // Send welcome email to the subscriber
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    if (customer.email) {
      await sendSubscriptionWelcomeEmail(customer.email, {
        planName: "Premium Plan", // You'd get this from your product data
        expiryDate: currentPeriodEnd.toLocaleDateString(),
      })
    }
    */
  } catch (error) {
    console.error("Error handling subscription creation:", error)
    throw error
  }
}

// Handler for completed checkout sessions
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("Checkout session completed:", session.id)

    // Extract customer information
    const customerId = session.customer as string
    const amount = session.amount_total
    const email = session.customer_email
    const metadata = session.metadata

    // Log detailed information
    console.log({
      event: "checkout_completed",
      sessionId: session.id,
      customerId,
      amount,
      email,
      metadata,
      status: "completed",
      createdAt: new Date(session.created * 1000).toISOString(),
    })

    // TODO: When Firebase is connected, store this information
    /*
    await db.checkoutSessions.create({
      data: {
        sessionId: session.id,
        customerId,
        amount,
        email,
        metadata,
        status: 'completed',
        createdAt: new Date(session.created * 1000),
      }
    })
    */
  } catch (error) {
    console.error("Error handling checkout session completion:", error)
    throw error
  }
}
