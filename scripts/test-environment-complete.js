// Complete Environment Test - Single file with all checks
console.log("🔧 Complete Environment Test Starting...\n")

// Environment Variables Check
console.log("1️⃣ ENVIRONMENT VARIABLES CHECK")
console.log("=".repeat(60))

const requiredEnvVars = {
  STRIPE_SECRET_KEY: "Stripe Secret Key",
  STRIPE_WEBHOOK_SECRET: "Stripe Webhook Secret",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "Stripe Publishable Key",
  FIREBASE_PROJECT_ID: "Firebase Project ID",
  FIREBASE_CLIENT_EMAIL: "Firebase Client Email",
  FIREBASE_PRIVATE_KEY: "Firebase Private Key",
}

let envCheckPassed = true
const missingVars = []

Object.entries(requiredEnvVars).forEach(([key, description]) => {
  const value = process.env[key]
  const isPresent = value && value.trim() !== ""
  const status = isPresent ? "✅" : "❌"

  console.log(`${status} ${key.padEnd(35)} | ${description}`)

  if (!isPresent) {
    envCheckPassed = false
    missingVars.push(key)
  }
})

console.log("\n📋 Environment Summary:")
if (envCheckPassed) {
  console.log("✅ All required environment variables are present")
} else {
  console.log(`❌ Missing ${missingVars.length} required variables: ${missingVars.join(", ")}`)
}

// Configuration Validation
console.log("\n2️⃣ CONFIGURATION VALIDATION")
console.log("=".repeat(60))

let configValid = true

// Stripe validation
if (process.env.STRIPE_SECRET_KEY) {
  const validFormat = process.env.STRIPE_SECRET_KEY.startsWith("sk_")
  console.log(`${validFormat ? "✅" : "❌"} Stripe Secret Key format`)
  if (!validFormat) configValid = false
} else {
  console.log("❌ Stripe Secret Key missing")
  configValid = false
}

// Firebase validation
if (process.env.FIREBASE_PRIVATE_KEY) {
  const validKey = process.env.FIREBASE_PRIVATE_KEY.includes("-----BEGIN PRIVATE KEY-----")
  console.log(`${validKey ? "✅" : "❌"} Firebase Private Key format`)
  if (!validKey) configValid = false
} else {
  console.log("❌ Firebase Private Key missing")
  configValid = false
}

if (process.env.FIREBASE_CLIENT_EMAIL) {
  const validEmail =
    process.env.FIREBASE_CLIENT_EMAIL.includes("@") &&
    process.env.FIREBASE_CLIENT_EMAIL.includes(".iam.gserviceaccount.com")
  console.log(`${validEmail ? "✅" : "❌"} Firebase Client Email format`)
  if (!validEmail) configValid = false
} else {
  console.log("❌ Firebase Client Email missing")
  configValid = false
}

// API Endpoints Test
console.log("\n3️⃣ API ENDPOINTS TEST")
console.log("=".repeat(60))

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
console.log(`🌐 Testing against: ${baseUrl}`)

// Simple fetch implementation for Node.js compatibility
async function simpleFetch(url, options = {}) {
  try {
    // Try to use global fetch first (Node 18+)
    if (typeof fetch !== "undefined") {
      return await fetch(url, options)
    }

    // Fallback for older Node versions
    const https = await import("https")
    const http = await import("http")
    const { URL } = await import("url")

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const client = parsedUrl.protocol === "https:" ? https : http

      const req = client.request(
        url,
        {
          method: options.method || "GET",
          headers: options.headers || {},
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

      if (options.body) {
        req.write(options.body)
      }

      req.end()
    })
  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`)
  }
}

async function testEndpoints() {
  const endpoints = [
    { path: "/api/debug-stripe", name: "Stripe Debug" },
    { path: "/api/debug-firestore", name: "Firestore Debug" },
  ]

  let allEndpointsWorking = true

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`)
      const response = await simpleFetch(`${baseUrl}${endpoint.path}`)

      if (response.ok) {
        console.log(`✅ ${endpoint.name}: ${response.status} OK`)
      } else {
        console.log(`❌ ${endpoint.name}: ${response.status} ${response.statusText}`)
        allEndpointsWorking = false
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`)
      allEndpointsWorking = false
    }
  }

  return allEndpointsWorking
}

// Run all tests
async function runCompleteTest() {
  try {
    const endpointsWorking = await testEndpoints()

    console.log("\n4️⃣ FINAL RESULTS")
    console.log("=".repeat(60))

    console.log(`Environment Variables: ${envCheckPassed ? "✅ PASS" : "❌ FAIL"}`)
    console.log(`Configuration: ${configValid ? "✅ PASS" : "❌ FAIL"}`)
    console.log(`API Endpoints: ${endpointsWorking ? "✅ PASS" : "❌ FAIL"}`)

    const allTestsPassed = envCheckPassed && configValid && endpointsWorking

    console.log("\n" + "=".repeat(60))
    if (allTestsPassed) {
      console.log("🎉 ALL TESTS PASSED! Environment is ready.")
      process.exit(0)
    } else {
      console.log("❌ SOME TESTS FAILED. Check the details above.")

      if (!envCheckPassed) {
        console.log("\n🔧 To fix environment variables:")
        console.log("1. Go to Vercel Dashboard > Project > Settings > Environment Variables")
        console.log("2. Add the missing variables listed above")
        console.log("3. Redeploy the application")
      }

      if (!configValid) {
        console.log("\n🔧 To fix configuration:")
        console.log("1. Verify Stripe keys start with 'sk_' and 'pk_'")
        console.log("2. Ensure Firebase private key includes BEGIN/END markers")
        console.log("3. Check Firebase email format ends with .iam.gserviceaccount.com")
      }

      process.exit(1)
    }
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`)
    process.exit(1)
  }
}

// Start the test
runCompleteTest()
