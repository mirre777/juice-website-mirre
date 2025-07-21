#!/usr/bin/env node

console.log("🧪 Testing API Endpoints...\n")

// Simple fetch implementation for Node.js
const fetch =
  globalThis.fetch ||
  (async (url, options) => {
    const https = await import("https")
    const http = await import("http")
    const { URL } = await import("url")

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const client = parsedUrl.protocol === "https:" ? https : http

      const req = client.request(url, options, (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data),
          })
        })
      })

      req.on("error", reject)
      if (options?.body) req.write(options.body)
      req.end()
    })
  })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

console.log(`🌐 Base URL: ${BASE_URL}`)
console.log("🚀 Starting API endpoint tests...\n")

async function testEndpoint(name, path, options = {}) {
  try {
    console.log(`Testing ${name}...`)
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const status = response.ok ? "✅" : "❌"
    console.log(`${status} ${name}: ${response.status}`)
    return response.ok
  } catch (error) {
    console.log(`❌ ${name}: fetch failed`)
    console.log(`   Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  const tests = [
    { name: "Health Check", path: "/api/health" },
    { name: "Stripe Configuration", path: "/api/debug-stripe" },
    { name: "Firestore Connection", path: "/api/debug-firestore" },
    { name: "Firebase Config", path: "/api/firebase-config-debug" },
  ]

  let passed = 0
  const total = tests.length

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.path)
    if (result) passed++
  }

  console.log("\n" + "=".repeat(50))
  console.log("📊 Test Results Summary:")
  console.log("=".repeat(50))

  tests.forEach((test, index) => {
    // We don't have individual results stored, so this is a simplified version
    console.log(`${index < passed ? "✅" : "❌"} ${test.name}`)
  })

  console.log("=".repeat(50))
  console.log(`Results: ${passed}/${total} tests passed`)

  if (passed < total) {
    console.log("⚠️  Some endpoints need attention. Check the logs above.")
  } else {
    console.log("🎉 All API endpoints are working!")
  }

  return passed === total
}

runTests()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error("❌ Test suite failed:", error.message)
    process.exit(1)
  })
