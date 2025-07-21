// Simple API Endpoints Test Script (Node.js compatible)
// Tests critical API endpoints without external dependencies

console.log("🧪 Testing API Endpoints...\n")

// Use built-in fetch (Node.js 18+) or provide a simple implementation
const nodeFetch =
  globalThis.fetch ||
  (async (url, options) => {
    const https = await import("https")
    const http = await import("http")
    const { URL } = await import("url")

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const client = parsedUrl.protocol === "https:" ? https : http

      const req = client.request(
        url,
        {
          method: options?.method || "GET",
          headers: options?.headers || {},
        },
        (res) => {
          let data = ""
          res.on("data", (chunk) => (data += chunk))
          res.on("end", () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              text: () => Promise.resolve(data),
              json: () => Promise.resolve(JSON.parse(data)),
            })
          })
        },
      )

      req.on("error", reject)

      if (options?.body) {
        req.write(options.body)
      }

      req.end()
    })
  })

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

    const response = await nodeFetch(`${baseUrl}${endpoint.path}`, options)
    const data = await response.text()

    console.log(`${response.ok ? "✅" : "❌"} ${endpoint.name}: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.log(`   Response: ${data.substring(0, 200)}${data.length > 200 ? "..." : ""}`)
    } else {
      console.log(`   ✅ Response received successfully`)
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
    process.exit(0)
  } else {
    console.log("⚠️  Some endpoints need attention. Check the logs above.")
    process.exit(1)
  }
}

// Run the tests
runTests().catch((error) => {
  console.error(`❌ Test runner failed: ${error.message}`)
  process.exit(1)
})
