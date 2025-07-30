// Server-side script to check Stripe configuration
// This runs in Node.js environment (v0)

console.log("🔍 CHECKING STRIPE SERVER CONFIGURATION")
console.log("=======================================")

const checkStripeServerConfig = async () => {
  try {
    console.log("\n1️⃣ CHECKING STRIPE PACKAGE VERSION")
    console.log("-----------------------------------")

    // Try to import stripe and check version
    try {
      const stripe = require("stripe")
      console.log("✅ Stripe package available")

      // Check if we can access the version
      const packageJson = require("stripe/package.json")
      console.log("Stripe package version:", packageJson.version)

      // Check if version supports promotion codes (need v8.0.0+)
      const version = packageJson.version
      const majorVersion = Number.parseInt(version.split(".")[0])

      if (majorVersion >= 8) {
        console.log("✅ Stripe package version supports promotion codes")
      } else {
        console.log("❌ Stripe package version too old for promotion codes")
        console.log("   Need v8.0.0+ for full promotion code support")
      }
    } catch (error) {
      console.log("❌ Could not check Stripe package:", error.message)
    }

    console.log("\n2️⃣ CHECKING API CONFIGURATION")
    console.log("------------------------------")

    // Check environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    console.log("Stripe Secret Key:", stripeSecretKey ? "✅ Set" : "❌ Missing")
    console.log("Stripe Publishable Key:", stripePublishableKey ? "✅ Set" : "❌ Missing")

    if (stripeSecretKey) {
      // Check if it's test or live key
      const isTestKey = stripeSecretKey.startsWith("sk_test_")
      const isLiveKey = stripeSecretKey.startsWith("sk_live_")

      console.log("Key type:", isTestKey ? "Test" : isLiveKey ? "Live" : "Unknown")
    }

    console.log("\n3️⃣ TESTING PAYMENT INTENT CREATION")
    console.log("-----------------------------------")

    if (stripeSecretKey) {
      try {
        // Test creating a payment intent with promotion codes enabled
        const testResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tempId: "test-promo-debug",
              email: "test@example.com",
            }),
          },
        )

        console.log("Payment Intent API Response:", testResponse.status)

        if (testResponse.ok) {
          const data = await testResponse.json()
          console.log("✅ Payment Intent created successfully")
          console.log("Client Secret received:", !!data.clientSecret)
        } else {
          const errorText = await testResponse.text()
          console.log("❌ Payment Intent creation failed:", errorText)
        }
      } catch (error) {
        console.log("❌ Error testing Payment Intent:", error.message)
      }
    }

    console.log("\n4️⃣ PROMOTION CODE REQUIREMENTS")
    console.log("-------------------------------")
    console.log("📋 For promotion codes to work, you need:")
    console.log("  • Stripe API version: 2022-11-15 or later")
    console.log("  • Stripe package: v8.0.0 or later")
    console.log("  • PaymentElement options: promotionCodes: { enabled: true }")
    console.log("  • Active promotion codes in Stripe Dashboard")
    console.log("  • Account with promotion codes feature enabled")
  } catch (error) {
    console.log("❌ Error in server config check:", error)
  }
}

// Run the check
checkStripeServerConfig()
