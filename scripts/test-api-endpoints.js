// API Endpoints Test Script
// Tests all critical API endpoints to ensure they're working

console.log("🧪 Testing API Endpoints...\n")

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

console.log(`🌐 Base URL: ${baseUrl}\n`)

// Test endpoints
const endpoints = [
  {
    path: "/api/debug-stripe",
    name: "Stripe Configuration",
    method: "GET",
  },
  {
    path: "/api/debug-firestore",
    name: "Firestore Connection",
    method: "GET",
  },
  {
    path: "/api/trainer/create",
    name: "Trainer Creation",
    method: "POST",
    body: {
      name: "Test Trainer",
      email: "test@example.com",
      specialization: "Personal Training",
      location: "Amsterdam",
      experience: "5 years",
    },
  },
  {
    path: "/api/create-payment-intent",
    name: "Payment Intent Creation",
    method: "POST",
    body: {
      amount: 9900,
      currency: "eur",
    },
  },
]

async function testEndpoint(endpoint) {
  try {
    console.log(`Testing ${endpoint.name}...`)

    const options = {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body)
    }

    const response = await fetch(`${baseUrl}${endpoint.path}`, options)
    const data = await response.text()

    console.log(`✅ ${endpoint.name}: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.log(`   Response: ${data.substring(0, 200)}...`)
    }

    return { success: response.ok, status: response.status, data }
  } catch (error) {
    console.log(`❌ ${endpoint.name}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log("🚀 Starting API endpoint tests...\n")

  const results = []

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint)
    results.push({ ...endpoint, ...result })
    console.log("") // Add spacing
  }

  // Summary
  console.log("📊 Test Results Summary:")
  console.log("=".repeat(50))

  const passed = results.filter((r) => r.success).length
  const total = results.length

  results.forEach((result) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL"
    console.log(`${result.name.padEnd(25)} | ${status}`)
  })

  console.log("=".repeat(50))
  console.log(`Results: ${passed}/${total} tests passed`)

  if (passed === total) {
    console.log("🎉 All API endpoints are working!")
  } else {
    console.log("⚠️  Some endpoints need attention. Check the logs above.")
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testEndpoint, runTests }
