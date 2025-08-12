export async function POST(request: Request) {
  console.log("=== MINIMAL WEBHOOK TEST ===")

  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    console.log("Body length:", body.length)
    console.log("Body first 200 chars:", body.substring(0, 200))
    console.log("Signature header:", signature)
    console.log("Content-Type:", request.headers.get("content-type"))

    // Parse the body to see the event
    const event = JSON.parse(body)
    console.log("Event type:", event.type)
    console.log("Event ID:", event.id)

    return Response.json({
      received: true,
      eventType: event.type,
      bodyLength: body.length,
    })
  } catch (error) {
    console.error("Minimal webhook error:", error)
    return Response.json({ error: "Failed" }, { status: 400 })
  }
}
