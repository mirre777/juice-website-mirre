/**
 * Debug script for Stripe promotion codes in PaymentElement
 * This script will help identify why promotion codes aren't showing up
 */

console.log("🔍 DEBUGGING PROMOTION CODES FOR STRIPE PAYMENT ELEMENT")
console.log("=".repeat(60))

// Test data
const testTempId = "temp_175381126719_53n4o1bbe" // Replace with actual temp ID
const testEmail = "mirresnelting@gmail.com"

async function debugPromotionCodes() {
  try {
    console.log("1️⃣ TESTING PAYMENT INTENT CREATION")
    console.log("-".repeat(40))

    // Test payment intent creation
    const paymentIntentResponse = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: testTempId,
        email: testEmail,
      }),
    })

    console.log("Payment Intent Response Status:", paymentIntentResponse.status)

    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.json()
      console.error("❌ Payment Intent Creation Failed:", errorData)
      return
    }

    const paymentData = await paymentIntentResponse.json()
    console.log("✅ Payment Intent Created:", paymentData.paymentIntentId)
    console.log("Client Secret:", paymentData.clientSecret ? "Present" : "Missing")

    console.log("\n2️⃣ TESTING STRIPE COUPONS API")
    console.log("-".repeat(40))

    // Test if we can fetch coupons (this would be a server-side test)
    console.log("📝 Manual Check Required:")
    console.log("- Go to Stripe Dashboard → Product Catalog → Coupons")
    console.log("- Verify JUICEFRIENDS and ONLYMIRRE coupons exist")
    console.log("- Check if coupons are 'Active' status")
    console.log("- Verify coupons have promotion codes created")

    console.log("\n3️⃣ TESTING PAYMENT ELEMENT CONFIGURATION")
    console.log("-".repeat(40))

    // Check if PaymentElement is configured correctly
    const paymentElementConfig = {
      layout: "tabs",
      business: {
        name: "Juice Fitness",
      },
      fields: {
        billingDetails: {
          name: "auto",
          email: "auto",
          address: "auto",
        },
      },
    }

    console.log("✅ PaymentElement Config:", JSON.stringify(paymentElementConfig, null, 2))

    console.log("\n4️⃣ CHECKING STRIPE API VERSION")
    console.log("-".repeat(40))
    console.log("Current Stripe API Version: 2024-06-20")
    console.log("📝 Note: Promotion codes in PaymentElement require specific API versions")

    console.log("\n5️⃣ PROMOTION CODE VISIBILITY CONDITIONS")
    console.log("-".repeat(40))
    console.log("Promotion codes appear when:")
    console.log("✓ Valid coupons exist in Stripe Dashboard")
    console.log("✓ Coupons have promotion codes created")
    console.log("✓ Coupons are in 'Active' status")
    console.log("✓ PaymentIntent currency matches coupon currency")
    console.log("✓ Customer location allows the coupon")
    console.log("✓ Coupon hasn't reached usage limits")

    console.log("\n6️⃣ TESTING PROMOTION CODE MANUALLY")
    console.log("-".repeat(40))

    // Test promotion code validation (server-side would be better)
    console.log("🧪 Manual Test Steps:")
    console.log("1. Open browser dev tools")
    console.log("2. Go to payment page")
    console.log("3. Look for 'Add promotion code' link")
    console.log("4. If not visible, check Stripe Elements console logs")
    console.log("5. Try different browsers/devices")

    console.log("\n7️⃣ ALTERNATIVE SOLUTIONS")
    console.log("-".repeat(40))
    console.log("If promotion codes still don't appear:")
    console.log("• Add manual discount code input field")
    console.log("• Apply discounts server-side before PaymentIntent")
    console.log("• Use Stripe Checkout instead of PaymentElement")
    console.log("• Contact Stripe support for account-specific issues")

    console.log("\n8️⃣ DEBUGGING CHECKLIST")
    console.log("-".repeat(40))
    console.log("□ Coupons exist and are active")
    console.log("□ Promotion codes are created for coupons")
    console.log("□ PaymentIntent created successfully")
    console.log("□ Currency matches (EUR)")
    console.log("□ No usage limits reached")
    console.log("□ Customer location allows coupon")
    console.log("□ Stripe API version supports promotion codes")

    console.log("\n🎯 NEXT STEPS")
    console.log("-".repeat(40))
    console.log("1. Verify all checklist items above")
    console.log("2. Check Stripe Dashboard for promotion code settings")
    console.log("3. Test with different coupon configurations")
    console.log("4. Consider implementing manual discount field")
  } catch (error) {
    console.error("❌ Debug script failed:", error)
  }
}

// Run the debug script
debugPromotionCodes()

// Additional helper functions
window.debugStripePromotionCodes = {
  // Test if Stripe is loaded
  checkStripeLoaded: () => {
    console.log("Stripe loaded:", typeof window.Stripe !== "undefined")
    return typeof window.Stripe !== "undefined"
  },

  // Check PaymentElement instance
  checkPaymentElement: () => {
    const paymentElements = document.querySelectorAll('[data-testid="payment-element"]')
    console.log("PaymentElement instances found:", paymentElements.length)
    return paymentElements.length > 0
  },

  // Look for promotion code elements
  findPromotionCodeElements: () => {
    const promotionElements = document.querySelectorAll(
      '[data-testid*="promotion"], [class*="promotion"], [id*="promotion"]',
    )
    console.log("Promotion-related elements found:", promotionElements.length)
    promotionElements.forEach((el, index) => {
      console.log(`Element ${index}:`, el.tagName, el.className, el.textContent?.slice(0, 50))
    })
    return promotionElements
  },

  // Check for Stripe console messages
  checkStripeConsole: () => {
    console.log("💡 Check browser console for Stripe-specific messages")
    console.log("Look for messages containing 'promotion', 'coupon', or 'discount'")
  },
}

console.log("\n🛠️ ADDITIONAL DEBUG TOOLS AVAILABLE:")
console.log("- window.debugStripePromotionCodes.checkStripeLoaded()")
console.log("- window.debugStripePromotionCodes.checkPaymentElement()")
console.log("- window.debugStripePromotionCodes.findPromotionCodeElements()")
console.log("- window.debugStripePromotionCodes.checkStripeConsole()")
