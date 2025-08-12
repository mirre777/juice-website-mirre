import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("\n=== WEBHOOK DEBUG START ===")

    // Get headers
    const headers = Object.fromEntries(request.headers.entries())
    console.log("1. Headers received:", JSON.stringify(headers, null, 2))

    // Get raw body as text (what Stripe signature verification needs)
    const rawBody = await request.text()
    console.log("2. Raw body length:", rawBody.length)
    console.log("3. Raw body first 200 chars:", rawBody.substring(0, 200))
    console.log("4. Raw body last 200 chars:", rawBody.substring(rawBody.length - 200))

    // Try to parse as JSON
    let parsedBody
    try {
      parsedBody = JSON.parse(rawBody)
      console.log("5. Successfully parsed as JSON")
      console.log("6. Event type:", parsedBody.type)
      console.log("7. Event ID:", parsedBody.id)
    } catch (parseError) {
      console.log("5. Failed to parse as JSON:", parseError)
    }

    // Check if re-stringifying changes anything
    if (parsedBody) {
      const restringified = JSON.stringify(parsedBody)
      console.log("8. Re-stringified length:", restringified.length)
      console.log("9. Bodies match after re-stringify:", rawBody === restringified)

      if (rawBody !== restringified) {
        console.log("10. BODY MODIFICATION DETECTED!")
        console.log("    Original hash:", require("crypto").createHash("sha256").update(rawBody).digest("hex"))
        console.log(
          "    Re-stringified hash:",
          require("crypto").createHash("sha256").update(restringified).digest("hex"),
        )
      }
    }

    // Check Stripe signature header
    const stripeSignature = headers["stripe-signature"]
    console.log("11. Stripe signature header:", stripeSignature)

    if (stripeSignature) {
      // Parse signature components
      const sigElements = stripeSignature.split(",")
      console.log("12. Signature elements:", sigElements)
    }

    console.log("=== WEBHOOK DEBUG END ===\n")

    return NextResponse.json({
      status: "debug_complete",
      bodyLength: rawBody.length,
      hasSignature: !!stripeSignature,
      eventType: parsedBody?.type || "unknown",
    })
  } catch (error) {
    console.error("Debug webhook error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Debug webhook endpoint - use POST" })
}
