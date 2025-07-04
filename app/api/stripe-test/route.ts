import { NextResponse } from "next/server"

// Add basic authentication to the API
function isAuthenticated(request: Request): boolean {
  // In production, you would implement proper authentication
  // This is a simple example using a query parameter
  const url = new URL(request.url)
  const debugToken = url.searchParams.get("debug_token")

  // Use an environment variable for the token or a more secure method
  return debugToken === process.env.DEBUG_TOKEN
}

export async function GET(request: Request) {
  // Check if authenticated
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Check if the Stripe secret key is set
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const hasStripeKey = !!stripeKey

    // Get basic info about the key without exposing it
    let keyInfo = "not set"
    if (hasStripeKey) {
      const firstFour = stripeKey?.substring(0, 4) || ""
      const lastFour = stripeKey?.slice(-4) || ""
      const keyLength = stripeKey?.length || 0
      keyInfo = `${firstFour}...${lastFour} (length: ${keyLength})`

      // Check if it's a test key
      const isTestKey = firstFour === "sk_t" || stripeKey?.includes("_test_")
      keyInfo += isTestKey ? " (TEST MODE)" : " (LIVE MODE)"
    }

    // Check if the publishable key is set
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const hasPublishableKey = !!publishableKey

    // Get basic info about the publishable key
    let publishableKeyInfo = "not set"
    if (hasPublishableKey) {
      const firstFour = publishableKey?.substring(0, 4) || ""
      const lastFour = publishableKey?.slice(-4) || ""
      const keyLength = publishableKey?.length || 0
      publishableKeyInfo = `${firstFour}...${lastFour} (length: ${keyLength})`

      // Check if it's a test key
      const isTestKey = firstFour === "pk_t" || publishableKey?.includes("_test_")
      publishableKeyInfo += isTestKey ? " (TEST MODE)" : " (LIVE MODE)"
    }

    // Return the status of the Stripe configuration
    return NextResponse.json({
      stripeSecretKeySet: hasStripeKey,
      keyInfo,
      publishableKeySet: hasPublishableKey,
      publishableKeyInfo,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in stripe-test route:", error)
    return NextResponse.json(
      {
        error: "Failed to check Stripe configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
