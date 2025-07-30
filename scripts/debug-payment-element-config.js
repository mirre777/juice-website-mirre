// Debug PaymentElement Configuration for Promotion Codes
// Run this in browser console on your payment page

console.log("🔍 DEBUGGING PAYMENT ELEMENT CONFIGURATION")
console.log("==============================================")

// 1. Check Stripe API Version
console.log("\n1️⃣ CHECKING STRIPE API VERSION")
console.log("------------------------------")

// Check what API version is being used
const checkApiVersion = () => {
  try {
    // Look for Stripe API version in network requests
    const performanceEntries = performance.getEntriesByType("resource")
    const stripeRequests = performanceEntries.filter(
      (entry) => entry.name.includes("stripe.com") || entry.name.includes("js.stripe.com"),
    )

    console.log("Stripe-related requests:", stripeRequests.length)
    stripeRequests.forEach((req) => {
      console.log(`  📡 ${req.name}`)
    })

    // Check if Stripe object exists and its version
    if (typeof window.Stripe !== "undefined") {
      console.log("✅ Stripe.js loaded")
      console.log("Stripe object:", window.Stripe)
    } else {
      console.log("❌ Stripe.js not loaded")
    }
  } catch (error) {
    console.log("❌ Error checking API version:", error)
  }
}

checkApiVersion()

// 2. Check PaymentElement Configuration
console.log("\n2️⃣ CHECKING PAYMENT ELEMENT CONFIGURATION")
console.log("------------------------------------------")

const checkPaymentElementConfig = () => {
  try {
    // Look for Elements instances
    const elementsContainers = document.querySelectorAll('[data-testid="payment-element"]')
    console.log(`Found ${elementsContainers.length} PaymentElement containers`)

    // Check for promotion code related elements
    const promoElements = document.querySelectorAll(
      '[data-testid*="promo"], [data-testid*="coupon"], [class*="promo"], [class*="coupon"]',
    )
    console.log(`Found ${promoElements.length} promotion-related elements`)

    promoElements.forEach((el, index) => {
      console.log(`  🎫 Element ${index + 1}:`, el.className, el.getAttribute("data-testid"))
    })

    // Check for "Add promotion code" text or links
    const bodyText = document.body.innerText.toLowerCase()
    const hasPromoText = bodyText.includes("promotion") || bodyText.includes("coupon") || bodyText.includes("discount")
    console.log(`Page contains promotion-related text: ${hasPromoText}`)

    // Look for hidden promotion code fields
    const hiddenPromoFields = document.querySelectorAll(
      'input[type="hidden"][name*="promo"], input[style*="display: none"][name*="promo"]',
    )
    console.log(`Found ${hiddenPromoFields.length} hidden promotion fields`)
  } catch (error) {
    console.log("❌ Error checking PaymentElement config:", error)
  }
}

checkPaymentElementConfig()

// 3. Check Elements Options
console.log("\n3️⃣ CHECKING ELEMENTS OPTIONS")
console.log("-----------------------------")

const checkElementsOptions = () => {
  try {
    // Try to access React DevTools to see component props
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log("✅ React DevTools available")
      console.log("Check React DevTools for Elements component props")
    } else {
      console.log("❌ React DevTools not available")
    }

    // Check for Elements configuration in window/global scope
    const globalKeys = Object.keys(window).filter(
      (key) =>
        key.toLowerCase().includes("stripe") ||
        key.toLowerCase().includes("element") ||
        key.toLowerCase().includes("payment"),
    )

    console.log("Global Stripe-related variables:", globalKeys)
  } catch (error) {
    console.log("❌ Error checking Elements options:", error)
  }
}

checkElementsOptions()

// 4. Network Request Analysis
console.log("\n4️⃣ ANALYZING NETWORK REQUESTS")
console.log("------------------------------")

const analyzeNetworkRequests = () => {
  try {
    // Monitor for new Stripe API calls
    const originalFetch = window.fetch
    let stripeCallCount = 0

    window.fetch = function (...args) {
      const url = args[0]
      if (typeof url === "string" && url.includes("stripe.com")) {
        stripeCallCount++
        console.log(`🌐 Stripe API call #${stripeCallCount}:`, url)

        // Check if it's a promotion code related call
        if (url.includes("promotion") || url.includes("coupon")) {
          console.log("  🎫 This is a promotion code related call!")
        }
      }
      return originalFetch.apply(this, args)
    }

    console.log("✅ Network monitoring enabled for Stripe calls")
    console.log("Try interacting with the payment form to see API calls")
  } catch (error) {
    console.log("❌ Error setting up network monitoring:", error)
  }
}

analyzeNetworkRequests()

// 5. Manual Promotion Code Test
console.log("\n5️⃣ MANUAL PROMOTION CODE TEST")
console.log("------------------------------")

const testPromotionCodes = () => {
  console.log("Testing if promotion codes can be manually applied...")

  // Try to find any input fields that might accept promotion codes
  const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input:not([type])')
  console.log(`Found ${allInputs.length} text input fields`)

  allInputs.forEach((input, index) => {
    const placeholder = input.placeholder?.toLowerCase() || ""
    const name = input.name?.toLowerCase() || ""
    const id = input.id?.toLowerCase() || ""

    if (
      placeholder.includes("promo") ||
      placeholder.includes("coupon") ||
      name.includes("promo") ||
      name.includes("coupon") ||
      id.includes("promo") ||
      id.includes("coupon")
    ) {
      console.log(`  🎫 Potential promotion code field found:`, input)
    }
  })
}

testPromotionCodes()

console.log("\n📋 SUMMARY & RECOMMENDATIONS")
console.log("=============================")
console.log("1. Check if Stripe API version is 2022-11-15 or later")
console.log("2. Verify PaymentElement options include: promotionCodes: { enabled: true }")
console.log("3. Check if Elements are being re-rendered (causing config loss)")
console.log("4. Monitor network requests for promotion code API calls")
console.log("5. Consider adding manual promotion code field as fallback")

// Make functions available globally for manual testing
window.debugPaymentElementConfig = {
  checkApiVersion,
  checkPaymentElementConfig,
  checkElementsOptions,
  analyzeNetworkRequests,
  testPromotionCodes,
}

console.log("\n🔧 Functions available for manual testing:")
console.log("- window.debugPaymentElementConfig.checkApiVersion()")
console.log("- window.debugPaymentElementConfig.checkPaymentElementConfig()")
console.log("- window.debugPaymentElementConfig.testPromotionCodes()")
