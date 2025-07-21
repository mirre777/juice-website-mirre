// Debug script for trainer header visibility and token detection

console.log("=== TRAINER HEADER VISIBILITY DEBUG SCRIPT ===")

// Function to get URL parameters
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)
  return {
    token: urlParams.get("token"),
    debug_token: urlParams.get("debug_token"),
    all_params: Object.fromEntries(urlParams.entries()),
  }
}

// Function to test different URL scenarios
function testUrlScenarios() {
  console.log("\n=== URL PARAMETER TESTING ===")

  const currentUrl = window.location.href
  console.log("Current URL:", currentUrl)

  const params = getUrlParams()
  console.log("Current URL Parameters:", params)

  // Test URLs with tokens
  const testUrls = [
    `${window.location.origin}${window.location.pathname}?token=test123`,
    `${window.location.origin}${window.location.pathname}?debug_token=debug123`,
    `${window.location.origin}${window.location.pathname}?token=owner_token_here`,
  ]

  console.log("\nTest URLs you can try:")
  testUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`)
  })
}

// Function to simulate token detection
function simulateTokenDetection() {
  console.log("\n=== SIMULATING TOKEN DETECTION ===")

  const searchParams = new URLSearchParams(window.location.search)
  const token = searchParams.get("token")
  const debugToken = searchParams.get("debug_token")

  console.log("Simulated token detection:")
  console.log("- token:", token)
  console.log("- debug_token:", debugToken)
  console.log("- hasToken:", !!(token || debugToken))
  console.log("- isOwner would be:", !!(token || debugToken))
}

// Function to check if we're on the right page
function checkPageContext() {
  console.log("\n=== PAGE CONTEXT CHECK ===")

  const path = window.location.pathname
  console.log("Current path:", path)

  const trainerIdMatch = path.match(/\/marketplace\/trainer\/([^/]+)/)
  if (trainerIdMatch) {
    console.log("Trainer ID from URL:", trainerIdMatch[1])
    console.log("✅ On trainer profile page")
  } else {
    console.log("❌ Not on trainer profile page")
  }
}

// Function to add token to current URL
function addTokenToUrl(tokenValue = "owner_debug_token") {
  console.log("\n=== ADDING TOKEN TO URL ===")

  const currentUrl = new URL(window.location.href)
  currentUrl.searchParams.set("debug_token", tokenValue)

  console.log("New URL with token:", currentUrl.toString())
  console.log("Click this link to test with token:")
  console.log(`%c${currentUrl.toString()}`, "color: blue; text-decoration: underline;")

  return currentUrl.toString()
}

// Function to check React component state (if accessible)
function checkReactState() {
  console.log("\n=== REACT COMPONENT STATE CHECK ===")

  // Try to find React component instance
  const reactRoot = document.querySelector("[data-reactroot]") || document.querySelector("#__next")

  if (reactRoot) {
    console.log("✅ React root found")

    // Check for any elements that might indicate owner status
    const ownerElements = document.querySelectorAll('[class*="owner"], [class*="edit"], [class*="admin"]')
    console.log("Elements with owner/edit/admin classes:", ownerElements.length)

    // Check for header elements
    const headers = document.querySelectorAll('header, [role="banner"], .sticky')
    console.log("Potential header elements found:", headers.length)

    headers.forEach((header, index) => {
      console.log(`Header ${index + 1}:`, {
        tagName: header.tagName,
        classes: header.className,
        visible: header.offsetHeight > 0,
        content: header.textContent?.substring(0, 100) + "...",
      })
    })
  } else {
    console.log("❌ React root not found")
  }
}

// Main debug function
function runDebug() {
  console.log("Starting trainer header visibility debug...\n")

  checkPageContext()
  testUrlScenarios()
  simulateTokenDetection()
  checkReactState()

  const tokenUrl = addTokenToUrl()

  console.log("\n=== SUMMARY ===")
  console.log("Issue: No token detected in URL, so isOwner = false")
  console.log("Solution: Add a token parameter to the URL")
  console.log("\n🔧 Quick fix - Run this in console:")
  console.log(`window.location.href = "${tokenUrl}"`)

  console.log("\n📋 Manual steps:")
  console.log("1. Add ?debug_token=test123 to your current URL")
  console.log("2. Or add ?token=your_actual_token to the URL")
  console.log("3. Refresh the page")
  console.log("4. Check console for 'isOwner: true'")
}

// Auto-run the debug
runDebug()

// Export functions for manual testing
window.trainerDebug = {
  getUrlParams,
  testUrlScenarios,
  simulateTokenDetection,
  checkPageContext,
  addTokenToUrl,
  checkReactState,
  runDebug,

  // Quick action to add token and reload
  addTokenAndReload: (token = "debug_owner_token") => {
    const newUrl = addTokenToUrl(token)
    console.log("Redirecting to:", newUrl)
    window.location.href = newUrl
  },
}

console.log("\n💡 Available debug functions:")
console.log("- trainerDebug.addTokenAndReload() - Add token and reload page")
console.log("- trainerDebug.runDebug() - Run full debug again")
console.log("- trainerDebug.getUrlParams() - Check current URL params")
