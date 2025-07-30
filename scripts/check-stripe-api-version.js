// Check Stripe API Version from Network Requests
// This will help identify if we're using an old API version

console.log("🔍 CHECKING STRIPE API VERSION FROM REQUESTS")
console.log("=============================================")

// Function to check API version from create-payment-intent
const checkStripeApiVersion = async () => {
  try {
    console.log("\n1️⃣ CHECKING CREATE-PAYMENT-INTENT API")
    console.log("--------------------------------------")

    // Make a test request to see what API version we're using
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: "test-temp-id",
        email: "test@example.com",
      }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:")

    // Check response headers for Stripe API version
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`)
      if (key.toLowerCase().includes("stripe") || key.toLowerCase().includes("version")) {
        console.log(`  🎯 IMPORTANT: ${key}: ${value}`)
      }
    }

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Payment intent created successfully")
      console.log("Client secret received:", !!data.clientSecret)
    } else {
      console.log("❌ Error creating payment intent")
      const errorData = await response.text()
      console.log("Error:", errorData)
    }
  } catch (error) {
    console.log("❌ Error checking API version:", error)
  }
}

// Function to check current Stripe.js version
const checkStripeJsVersion = () => {
  console.log("\n2️⃣ CHECKING STRIPE.JS VERSION")
  console.log("------------------------------")

  try {
    if (typeof window.Stripe !== "undefined") {
      console.log("✅ Stripe.js loaded")

      // Try to get version info
      const stripeScript = document.querySelector('script[src*="js.stripe.com"]')
      if (stripeScript) {
        console.log("Stripe.js script source:", stripeScript.src)

        // Extract version from URL if possible
        const versionMatch = stripeScript.src.match(/v(\d+)/)
        if (versionMatch) {
          console.log("Stripe.js version:", versionMatch[1])
        }
      }

      // Check Stripe object properties
      console.log("Available Stripe methods:", Object.getOwnPropertyNames(window.Stripe))
    } else {
      console.log("❌ Stripe.js not loaded")
    }
  } catch (error) {
    console.log("❌ Error checking Stripe.js version:", error)
  }
}

// Function to check what API version supports promotion codes
const checkPromotionCodeSupport = () => {
  console.log("\n3️⃣ PROMOTION CODE API VERSION REQUIREMENTS")
  console.log("-------------------------------------------")
  console.log("📋 Promotion codes in PaymentElement require:")
  console.log("  • Stripe API version: 2022-11-15 or later")
  console.log("  • Stripe.js version: v3 (latest)")
  console.log("  • PaymentElement options: promotionCodes: { enabled: true }")
  console.log("  • Account must have promotion codes feature enabled")
  console.log("")
  console.log("🔧 If using older API version, you need to:")
  console.log("  1. Update Stripe API version in your backend")
  console.log("  2. Update stripe npm package to latest")
  console.log("  3. Ensure PaymentElement configuration is correct")
}

// Run all checks
const runAllChecks = async () => {
  checkPromotionCodeSupport()
  checkStripeJsVersion()
  await checkStripeApiVersion()

  console.log("\n📋 NEXT STEPS")
  console.log("=============")
  console.log("1. Check the API version shown above")
  console.log("2. If it's older than 2022-11-15, update your Stripe API version")
  console.log("3. Verify PaymentElement configuration includes promotion codes")
  console.log("4. Test with the browser debug script")
}

// Make available globally
window.checkStripeApiVersion = runAllChecks

// Auto-run
runAllChecks()
