// Debug script to compare Stripe webhook body processing
// This will help identify if the raw request body is being modified

const crypto = require("crypto")

// Simulate what Stripe sends (from your example)
const originalStripePayload = `{
  "id": "evt_1RvFJuKB3FG9zp2lZenlcqpQ",
  "object": "event",
  "api_version": "2025-03-31.basil",
  "created": 1754994042,
  "data": {
    "object": {
      "id": "cs_live_b1yiU2JAxdY14Zra1phhVIJOieg8qRpoe2KGdcnhs7pTiJjEmCvVpNhyFz",
      "object": "checkout.session",
      "status": "complete"
    }
  },
  "livemode": true,
  "pending_webhooks": 2,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
}`

// Test different body processing methods
console.log("=== WEBHOOK BODY DEBUG ===\n")

console.log("1. Original Stripe payload length:", originalStripePayload.length)
console.log("2. Original payload hash:", crypto.createHash("sha256").update(originalStripePayload).digest("hex"))

// Test JSON.parse + JSON.stringify (what might happen in processing)
const parsed = JSON.parse(originalStripePayload)
const restringified = JSON.stringify(parsed)

console.log("3. After JSON.parse + JSON.stringify length:", restringified.length)
console.log("4. After processing hash:", crypto.createHash("sha256").update(restringified).digest("hex"))

console.log("5. Bodies match:", originalStripePayload === restringified)

// Show differences
if (originalStripePayload !== restringified) {
  console.log("\n=== DIFFERENCES FOUND ===")
  console.log("Original first 200 chars:", originalStripePayload.substring(0, 200))
  console.log("Processed first 200 chars:", restringified.substring(0, 200))

  // Find first difference
  for (let i = 0; i < Math.min(originalStripePayload.length, restringified.length); i++) {
    if (originalStripePayload[i] !== restringified[i]) {
      console.log(`First difference at position ${i}:`)
      console.log(`Original: "${originalStripePayload[i]}" (${originalStripePayload.charCodeAt(i)})`)
      console.log(`Processed: "${restringified[i]}" (${restringified.charCodeAt(i)})`)
      break
    }
  }
}

console.log("\n=== WEBHOOK ENDPOINT DEBUG ===")
