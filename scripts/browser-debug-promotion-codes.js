/**
 * Browser-side debug script for Stripe promotion codes
 * Copy and paste this into browser console on the payment page
 */

console.log("🔍 BROWSER DEBUG: STRIPE PROMOTION CODES")
console.log("=".repeat(50))

function debugPromotionCodesInBrowser() {
  console.log("1️⃣ CHECKING STRIPE ELEMENTS")
  console.log("-".repeat(30))

  // Check if Stripe is loaded
  const stripeLoaded = typeof window.Stripe !== "undefined"
  console.log("Stripe loaded:", stripeLoaded ? "✅ YES" : "❌ NO")

  // Find PaymentElement
  const paymentElements = document.querySelectorAll(
    '[data-testid*="payment"], [class*="PaymentElement"], iframe[name*="__privateStripeFrame"]',
  )
  console.log("PaymentElement found:", paymentElements.length > 0 ? "✅ YES" : "❌ NO")
  console.log("Elements found:", paymentElements.length)

  console.log("\n2️⃣ LOOKING FOR PROMOTION CODE ELEMENTS")
  console.log("-".repeat(30))

  // Look for promotion code related elements
  const promotionSelectors = [
    '[data-testid*="promotion"]',
    '[class*="promotion"]',
    '[id*="promotion"]',
    'a[href*="promotion"]',
    'button[aria-label*="promotion"]',
    'button[aria-label*="coupon"]',
    'a[aria-label*="discount"]',
    '*[title*="promotion"]',
    '*[title*="coupon"]',
    '*[title*="discount"]',
  ]

  const foundElements = []
  promotionSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    if (elements.length > 0) {
      foundElements.push({ selector, count: elements.length, elements })
    }
  })

  if (foundElements.length > 0) {
    console.log("✅ Promotion elements found:")
    foundElements.forEach((item) => {
      console.log(`- ${item.selector}: ${item.count} elements`)
      item.elements.forEach((el, i) => {
        console.log(`  ${i}: ${el.tagName} - "${el.textContent?.slice(0, 50)}"`)
      })
    })
  } else {
    console.log("❌ No promotion code elements found")
  }

  console.log("\n3️⃣ CHECKING FOR 'ADD PROMOTION CODE' LINKS")
  console.log("-".repeat(30))

  // Look specifically for "Add promotion code" text
  const allElements = document.querySelectorAll("*")
  const promotionLinks = []

  allElements.forEach((el) => {
    const text = el.textContent?.toLowerCase() || ""
    if (text.includes("promotion") || text.includes("coupon") || text.includes("discount")) {
      promotionLinks.push({
        element: el,
        text: el.textContent?.slice(0, 100),
        tag: el.tagName,
        classes: el.className,
      })
    }
  })

  if (promotionLinks.length > 0) {
    console.log("✅ Found promotion-related text:")
    promotionLinks.forEach((item, i) => {
      console.log(`${i + 1}. ${item.tag}: "${item.text}"`)
      console.log(`   Classes: ${item.classes}`)
    })
  } else {
    console.log("❌ No promotion-related text found")
  }

  console.log("\n4️⃣ CHECKING STRIPE IFRAME CONTENT")
  console.log("-".repeat(30))

  const stripeIframes = document.querySelectorAll('iframe[name*="__privateStripeFrame"]')
  console.log(`Found ${stripeIframes.length} Stripe iframes`)

  if (stripeIframes.length > 0) {
    console.log("⚠️ Cannot inspect iframe content due to CORS")
    console.log("Check browser Network tab for Stripe API calls")
  }

  console.log("\n5️⃣ CONSOLE LOG ANALYSIS")
  console.log("-".repeat(30))

  console.log("💡 Look for these in console:")
  console.log("- Stripe API errors")
  console.log("- PaymentElement configuration logs")
  console.log("- Promotion code related warnings")

  console.log("\n6️⃣ NETWORK TAB ANALYSIS")
  console.log("-".repeat(30))

  console.log("💡 Check Network tab for:")
  console.log("- /v1/payment_intents API calls")
  console.log("- /v1/promotion_codes API calls")
  console.log("- Any 4xx/5xx errors")

  console.log("\n7️⃣ MANUAL TESTS")
  console.log("-".repeat(30))

  console.log("Try these manual tests:")
  console.log("1. Right-click on payment form → Inspect")
  console.log("2. Look for hidden promotion code fields")
  console.log("3. Try different payment methods (Card/PayPal)")
  console.log("4. Test in incognito/private browsing")
  console.log("5. Test on different devices/browsers")

  console.log("\n✅ BROWSER DEBUG COMPLETED")
  console.log("Check the findings above!")
}

// Run the browser debug
debugPromotionCodesInBrowser()

// Make function available globally for re-running
window.debugPromotionCodes = debugPromotionCodesInBrowser
