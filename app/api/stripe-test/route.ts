import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  const debugId = Math.random().toString(36).slice(2, 8)

  console.log(`[test-webhook-${debugId}] === INCOMING REQUEST ===`)
  console.log(`[test-webhook-${debugId}] URL: ${request.url}`)
  console.log(`[test-webhook-${debugId}] Host: ${request.headers.get("host")}`)
  console.log(`[test-webhook-${debugId}] X-Forwarded-Host: ${request.headers.get("x-forwarded-host")}`)

  // Check signature header
  const sig = request.headers.get("stripe-signature")
  console.log(`[test-webhook-${debugId}] Signature present: ${!!sig}`)
  console.log(`[test-webhook-${debugId}] Signature length: ${sig?.length || 0}`)
  console.log(`[test-webhook-${debugId}] Signature preview: ${sig?.substring(0, 100)}...`)

  // Check environment variables
  const secret1 = process.env.STRIPE_WEBHOOK_SECRET
  const secret2 = process.env.STRIPE_WEBHOOK_SECRET_2
  console.log(`[test-webhook-${debugId}] Secret 1 present: ${!!secret1}`)
  console.log(`[test-webhook-${debugId}] Secret 1 tail: ${secret1?.slice(-6) || "none"}`)
  console.log(`[test-webhook-${debugId}] Secret 2 present: ${!!secret2}`)
  console.log(`[test-webhook-${debugId}] Secret 2 tail: ${secret2?.slice(-6) || "none"}`)

  if (!sig) {
    console.log(`[test-webhook-${debugId}] ERROR: No signature header`)
    return NextResponse.json({ error: "No signature", debugId }, { status: 400 })
  }

  // Get raw body
  const rawBody = await request.text()
  console.log(`[test-webhook-${debugId}] Body length: ${rawBody.length}`)
  console.log(`[test-webhook-${debugId}] Body start: ${rawBody.substring(0, 200)}...`)
  console.log(`[test-webhook-${debugId}] Body end: ...${rawBody.slice(-50)}`)

  // Try signature verification with each secret
  const secrets = [secret1, secret2].filter(Boolean) as string[]

  for (let i = 0; i < secrets.length; i++) {
    const secret = secrets[i]
    console.log(`[test-webhook-${debugId}] Trying secret ${i + 1} (tail: ${secret.slice(-6)})`)

    try {
      const event = stripe.webhooks.constructEvent(rawBody, sig, secret)
      console.log(`[test-webhook-${debugId}] SUCCESS with secret ${i + 1}!`)
      console.log(`[test-webhook-${debugId}] Event ID: ${event.id}`)
      console.log(`[test-webhook-${debugId}] Event type: ${event.type}`)

      return NextResponse.json({
        success: true,
        debugId,
        usedSecret: i + 1,
        eventId: event.id,
        eventType: event.type,
      })
    } catch (err: any) {
      console.log(`[test-webhook-${debugId}] FAILED with secret ${i + 1}`)
      console.log(`[test-webhook-${debugId}] Error type: ${err?.type}`)
      console.log(`[test-webhook-${debugId}] Error message: ${err?.message}`)
    }
  }

  console.log(`[test-webhook-${debugId}] ALL SECRETS FAILED`)
  return NextResponse.json(
    {
      error: "All signature verifications failed",
      debugId,
      triedSecrets: secrets.length,
    },
    { status: 400 },
  )
}
