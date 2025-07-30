// Browser-side promotion codes debugging script
// Copy and paste this into your browser console on the payment page

async function debugPromotionCodesInBrowser() {
  console.log("🔍 BROWSER DEBUG: STRIPE PROMOTION CODES")
  console.log("==================================================")

  // 1. Check if Stripe is loaded
  console.log("1️⃣ CHECKING STRIPE ELEMENTS")
  console.log("------------------------------")

  const stripeLoaded = typeof window.Stripe !== "undefined"
  console.log("Stripe.js loaded:", stripeLoaded)

  if (!stripeLoaded) {
    console.log("❌ Stripe.js not loaded - this might be the issue!")
    return
  }

  // 2. Check Elements
  const elementsContainers = document.querySelectorAll('[data-testid="payment-element"]')
  console.log("Payment Elements found:", elementsContainers.length)

  // 3. Look for promotion code related elements
  console.log("\n2️⃣ LOOKING FOR PROMOTION CODE UI")
  console.log("-----------------------------------")

  const promoSelectors = [
    '[data-testid="promotion-code"]',
    '[data-testid="promo-code"]',
    '[data-testid="coupon-code"]',
    ".PromotionCodeContainer",
    ".PromoCodeInput",
    'input[placeholder*="promo"]',
    'input[placeholder*="coupon"]',
    'input[placeholder*="discount"]',
    '*[class*="promotion"]',
    '*[class*="promo"]',
    '*[class*="coupon"]',
    'button[aria-label*="promotion"]',
    'button[aria-label*="promo"]',
    'a[href*="promotion"]',
    'a[href*="promo"]',
  ]

  const foundPromoElements = []
  promoSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    if (elements.length > 0) {
      foundPromoElements.push({ selector, count: elements.length })
      console.log(`   ✅ Found ${elements.length} elements: ${selector}`)
    }
  })

  if (foundPromoElements.length === 0) {
    console.log("   ❌ No promotion code UI elements found")
  }

  // 4. Check iframe content (Stripe Elements are in iframes)
  console.log("\n3️⃣ CHECKING STRIPE IFRAMES")
  console.log("-----------------------------")

  const iframes = document.querySelectorAll('iframe[src*="stripe"]')
  console.log(`Found ${iframes.length} Stripe iframes`)

  iframes.forEach((iframe, index) => {
    console.log(`   Iframe ${index + 1}:`, iframe.src)
    console.log(`   Title:`, iframe.title || "No title")
    console.log(`   Name:`, iframe.name || "No name")
  })

  // 5. Check for React/Elements state
  console.log("\n4️⃣ CHECKING REACT ELEMENTS STATE")
  console.log("-----------------------------------")

  // Look for React fiber nodes that might contain Elements state
  const paymentElements = document.querySelectorAll(
    '[class*="payment"], [class*="stripe"], [id*="payment"], [id*="stripe"]',
  )
  console.log(`Found ${paymentElements.length} potential payment-related elements`)

  // 6. Check console for Stripe errors
  console.log("\n5️⃣ CHECKING FOR STRIPE ERRORS")
  console.log("--------------------------------")

  // Override console.error temporarily to catch Stripe errors
  const originalError = console.error
  const stripeErrors = []

  console.error = (...args) => {
    const message = args.join(" ")
    if (
      message.toLowerCase().includes("stripe") ||
      message.toLowerCase().includes("promotion") ||
      message.toLowerCase().includes("coupon")
    ) {
      stripeErrors.push(message)
    }
    originalError.apply(console, args)
  }

  // Restore after a short delay
  setTimeout(() => {
    console.error = originalError
    if (stripeErrors.length > 0) {
      console.log("   Found Stripe-related errors:")
      stripeErrors.forEach((error) => console.log(`   ❌ ${error}`))
    } else {
      console.log("   ✅ No Stripe errors detected")
    }
  }, 1000)

  // 7. Test API call to check promotion codes
  console.log("\n6️⃣ TESTING PROMOTION CODE API")
  console.log("--------------------------------")

  try {
    // Get current URL params to find tempId
    const urlParams = new URLSearchParams(window.location.search)
    const tempId = urlParams.get("tempId") || "test"

    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempId: tempId,
        email: "test@example.com",
      }),
    })

    const data = await response.json()
    console.log("   ✅ Payment Intent API working:", !!data.clientSecret)
    console.log("   Payment Intent ID:", data.paymentIntentId)
  } catch (error) {
    console.log("   ❌ Payment Intent API error:", error.message)
  }

  // 8. Summary and recommendations
  console.log("\n📋 BROWSER DEBUG SUMMARY")
  console.log("==========================")

  if (foundPromoElements.length === 0) {
    console.log("❌ PROMOTION CODES NOT VISIBLE IN UI")
    console.log("")
    console.log("Possible causes:")
    console.log("1. Promotion codes not enabled in Stripe Dashboard")
    console.log("2. No active promotion codes exist")
    console.log("3. PaymentElement options not configured correctly")
    console.log("4. Account doesn't support promotion codes")
    console.log("")
    console.log("Next steps:")
    console.log("1. Check Stripe Dashboard > Products > Coupons")
    console.log("2. Ensure promotion codes are created (not just coupons)")
    console.log("3. Verify promotion codes are active")
    console.log("4. Check PaymentElement configuration in code")
  } else {
    console.log("✅ Promotion code UI elements found!")
  }
}

// Auto-run the debug function
debugPromotionCodesInBrowser()

// Also make it available globally for manual execution
window.debugStripePromotionCodes = debugPromotionCodesInBrowser
