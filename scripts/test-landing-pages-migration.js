// Landing Pages Migration Test Script
// Tests all routes and verifies all references are working correctly

const testRoutes = [
  "/download-juice-app",
  "/findatrainer",
  "/gratis-fitness-app-danmark",
  "/gratis-workout-app-met-trainer",
  "/best-free-workout-app-uk",
  "/trainingsplan-app-gratis",
  "/personal-training-amsterdam",
  "/personal-training-berlin",
  "/personal-training-koebenhavn",
  "/personal-training-muenchen",
  "/personal-training-wien",
  "/getclients",
]

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

console.log("[v0] Starting Landing Pages Migration Test...\n")

async function testRoute(route) {
  try {
    const response = await fetch(`${baseUrl}${route}`)
    const status = response.status
    const statusText = response.ok ? "✅ PASS" : "❌ FAIL"

    console.log(`${statusText} ${route} - Status: ${status}`)

    if (response.ok) {
      const html = await response.text()

      // Check for critical elements
      const hasTitle = html.includes("<title>")
      const hasCanonical = html.includes('rel="canonical"')
      const hasOpenGraph = html.includes('property="og:')

      console.log(`  📄 Title: ${hasTitle ? "✅" : "❌"}`)
      console.log(`  🔗 Canonical: ${hasCanonical ? "✅" : "❌"}`)
      console.log(`  📱 OpenGraph: ${hasOpenGraph ? "✅" : "❌"}`)

      return { route, status, success: true, hasTitle, hasCanonical, hasOpenGraph }
    }

    return { route, status, success: false }
  } catch (error) {
    console.log(`❌ FAIL ${route} - Error: ${error.message}`)
    return { route, status: "ERROR", success: false, error: error.message }
  }
}

async function testAllRoutes() {
  console.log("🧪 Testing all landing page routes...\n")

  const results = []

  for (const route of testRoutes) {
    const result = await testRoute(route)
    results.push(result)
    console.log("") // Empty line for readability
  }

  // Summary
  const passed = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log("\n📊 MIGRATION TEST SUMMARY")
  console.log("========================")
  console.log(`✅ Passed: ${passed}/${testRoutes.length}`)
  console.log(`❌ Failed: ${failed}/${testRoutes.length}`)

  if (failed > 0) {
    console.log("\n❌ Failed Routes:")
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.route} (Status: ${r.status})`)
      })
  }

  // Check SEO metadata completeness
  const seoIssues = results.filter((r) => r.success && (!r.hasTitle || !r.hasCanonical || !r.hasOpenGraph))
  if (seoIssues.length > 0) {
    console.log("\n⚠️  SEO Issues Found:")
    seoIssues.forEach((r) => {
      console.log(`  - ${r.route}:`)
      if (!r.hasTitle) console.log(`    📄 Missing title tag`)
      if (!r.hasCanonical) console.log(`    🔗 Missing canonical URL`)
      if (!r.hasOpenGraph) console.log(`    📱 Missing OpenGraph tags`)
    })
  }

  console.log("\n🎯 Migration Status:", failed === 0 ? "✅ SUCCESS" : "❌ NEEDS FIXES")

  return { passed, failed, total: testRoutes.length }
}

// Run the tests
testAllRoutes().catch(console.error)
