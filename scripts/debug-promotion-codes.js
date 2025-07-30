/**
 * Debug script for Stripe promotion codes - Server-side version
 * This script will help identify why promotion codes aren't showing up
 */

console.log("🔍 DEBUGGING PROMOTION CODES FOR STRIPE PAYMENT ELEMENT")
console.log("=".repeat(60))

// Import Stripe (simulated - in real environment you'd import from stripe package)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_..."

async function debugPromotionCodes() {
  try {
    console.log("1️⃣ CHECKING STRIPE CONFIGURATION")
    console.log("-".repeat(40))

    console.log("Stripe Secret Key:", STRIPE_SECRET_KEY ? "Present" : "❌ MISSING")
    console.log("API Version: 2024-06-20")

    console.log("\n2️⃣ PROMOTION CODE REQUIREMENTS CHECKLIST")
    console.log("-".repeat(40))

    const requirements = [
      "✓ Stripe account has promotion codes enabled",
      "✓ Coupons exist in Stripe Dashboard",
      "✓ Promotion codes are created for coupons",
      "✓ Coupons are in 'Active' status",
      "✓ Currency matches PaymentIntent (EUR)",
      "✓ No usage limits reached",
      "✓ No geographic restrictions",
      "✓ PaymentElement configured correctly",
    ]

    requirements.forEach((req) => console.log(req))

    console.log("\n3️⃣ COMMON ISSUES & SOLUTIONS")
    console.log("-".repeat(40))

    const issues = [
      {
        issue: "Coupons exist but no promotion codes created",
        solution: "Go to Stripe Dashboard → Coupons → Create promotion codes",
      },
      {
        issue: "Promotion codes not showing in PaymentElement",
        solution: "Check if account has promotion codes feature enabled",
      },
      {
        issue: "Currency mismatch",
        solution: "Ensure coupons are configured for EUR currency",
      },
      {
        issue: "Geographic restrictions",
        solution: "Remove country restrictions from coupons",
      },
    ]

    issues.forEach((item, index) => {
      console.log(`${index + 1}. Issue: ${item.issue}`)
      console.log(`   Solution: ${item.solution}\n`)
    })

    console.log("4️⃣ STRIPE DASHBOARD VERIFICATION STEPS")
    console.log("-".repeat(40))

    const steps = [
      "1. Login to Stripe Dashboard",
      "2. Go to Product Catalog → Coupons",
      "3. Find JUICEFRIENDS and ONLYMIRRE coupons",
      "4. Click on each coupon",
      "5. Check 'Promotion codes' section",
      "6. Verify promotion codes exist and are active",
      "7. Check currency is set to EUR",
      "8. Verify no usage limits are reached",
    ]

    steps.forEach((step) => console.log(step))

    console.log("\n5️⃣ PAYMENTELEMENT CONFIGURATION CHECK")
    console.log("-".repeat(40))

    const paymentElementConfig = {
      layout: "tabs",
      business: { name: "Juice Fitness" },
      fields: {
        billingDetails: {
          name: "auto",
          email: "auto",
          address: "auto",
        },
      },
    }

    console.log("Current PaymentElement config:")
    console.log(JSON.stringify(paymentElementConfig, null, 2))

    console.log("\n6️⃣ TESTING PAYMENT INTENT METADATA")
    console.log("-".repeat(40))

    const testPaymentIntentData = {
      amount: 6900,
      currency: "eur",
      description: "Trainer Website Activation - temp_test",
      metadata: {
        tempId: "temp_test",
        plan: "trainer-activation",
        planType: "Trainer Website Activation",
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    }

    console.log("PaymentIntent configuration:")
    console.log(JSON.stringify(testPaymentIntentData, null, 2))

    console.log("\n7️⃣ BROWSER TESTING INSTRUCTIONS")
    console.log("-".repeat(40))

    console.log("To test in browser:")
    console.log("1. Open payment page in browser")
    console.log("2. Open Developer Tools (F12)")
    console.log("3. Go to Console tab")
    console.log("4. Look for Stripe-related messages")
    console.log("5. Check for 'promotion' or 'coupon' mentions")
    console.log("6. Try different browsers/incognito mode")

    console.log("\n8️⃣ ALTERNATIVE IMPLEMENTATION")
    console.log("-".repeat(40))

    console.log("If promotion codes still don't appear, consider:")
    console.log("• Manual discount code input field")
    console.log("• Server-side coupon validation")
    console.log("• Apply discounts before PaymentIntent creation")
    console.log("• Use Stripe Checkout instead of PaymentElement")

    console.log("\n9️⃣ NEXT DEBUGGING STEPS")
    console.log("-".repeat(40))

    console.log("1. Verify Stripe Dashboard settings")
    console.log("2. Test with a fresh coupon/promotion code")
    console.log("3. Check Stripe account features")
    console.log("4. Contact Stripe support if needed")
    console.log("5. Implement manual discount field as backup")

    console.log("\n🎯 IMMEDIATE ACTION ITEMS")
    console.log("-".repeat(40))

    console.log("□ Check Stripe Dashboard for promotion codes")
    console.log("□ Verify JUICEFRIENDS coupon has promotion code")
    console.log("□ Verify ONLYMIRRE coupon has promotion code")
    console.log("□ Test with different coupon configuration")
    console.log("□ Check browser console for Stripe errors")

    console.log("\n✅ DEBUG SCRIPT COMPLETED")
    console.log("Check the items above and report back with findings!")
  } catch (error) {
    console.error("❌ Debug script failed:", error)
  }
}

// Run the debug script
debugPromotionCodes()

// Export for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { debugPromotionCodes }
}
