// Environment and Configuration Check Script
// This script verifies all required environment variables and services are properly configured

console.log("🔍 Starting Vercel Environment Check...\n")

// Check if we're in the right environment
console.log("📍 Environment Information:")
console.log(`- Node.js Version: ${process.version}`)
console.log(`- Platform: ${process.platform}`)
console.log(`- Current Working Directory: ${process.cwd()}`)
console.log("")

// Required environment variables
const requiredEnvVars = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: "Stripe Secret Key",
  STRIPE_WEBHOOK_SECRET: "Stripe Webhook Secret",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "Stripe Publishable Key",

  // Firebase Configuration
  FIREBASE_PROJECT_ID: "Firebase Project ID",
  FIREBASE_CLIENT_EMAIL: "Firebase Client Email",
  FIREBASE_PRIVATE_KEY: "Firebase Private Key",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "Firebase Project ID (Public)",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "Firebase Auth Domain (Public)",

  // Optional but recommended
  VERCEL_URL: "Vercel URL (auto-generated)",
  NODE_ENV: "Node Environment",
}

console.log("🔐 Environment Variables Check:")
console.log("=".repeat(50))

let allEnvVarsPresent = true
const criticalMissing = []

Object.entries(requiredEnvVars).forEach(([key, description]) => {
  const value = process.env[key]
  const isPresent = value && value.trim() !== ""
  const status = isPresent ? "✅ SET" : "❌ MISSING"

  console.log(`${key.padEnd(35)} | ${status} | ${description}`)

  if (!isPresent) {
    allEnvVarsPresent = false
    if (key.includes("STRIPE") || key.includes("FIREBASE")) {
      criticalMissing.push(key)
    }
  }
})

console.log("=".repeat(50))

// Test Stripe Configuration
console.log("\n💳 Testing Stripe Configuration:")
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const stripeKeyFormat = process.env.STRIPE_SECRET_KEY.startsWith("sk_")
    console.log(`- Secret Key Format: ${stripeKeyFormat ? "✅ Valid" : "❌ Invalid"}`)
    console.log(`- Secret Key Length: ${process.env.STRIPE_SECRET_KEY.length} characters`)

    // Check if it's test or live key
    const isTestKey = process.env.STRIPE_SECRET_KEY.includes("_test_")
    console.log(`- Key Type: ${isTestKey ? "🧪 Test Key" : "🔴 Live Key"}`)
  } else {
    console.log("- ❌ Stripe Secret Key not found")
  }

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    const pubKeyFormat = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
    console.log(`- Publishable Key Format: ${pubKeyFormat ? "✅ Valid" : "❌ Invalid"}`)

    const isTestPubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes("_test_")
    console.log(`- Publishable Key Type: ${isTestPubKey ? "🧪 Test Key" : "🔴 Live Key"}`)
  } else {
    console.log("- ❌ Stripe Publishable Key not found")
  }

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const webhookFormat = process.env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")
    console.log(`- Webhook Secret Format: ${webhookFormat ? "✅ Valid" : "❌ Invalid"}`)
  } else {
    console.log("- ❌ Stripe Webhook Secret not found")
  }
} catch (error) {
  console.log(`- ❌ Error checking Stripe config: ${error.message}`)
}

// Test Firebase Configuration
console.log("\n🔥 Testing Firebase Configuration:")
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    console.log("- ✅ All Firebase server credentials present")

    // Check Firebase Private Key format
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    const hasBeginKey = privateKey.includes("-----BEGIN PRIVATE KEY-----")
    const hasEndKey = privateKey.includes("-----END PRIVATE KEY-----")
    console.log(`- Private Key Format: ${hasBeginKey && hasEndKey ? "✅ Valid" : "❌ Invalid"}`)

    // Check email format
    const emailFormat =
      process.env.FIREBASE_CLIENT_EMAIL.includes("@") &&
      process.env.FIREBASE_CLIENT_EMAIL.includes(".iam.gserviceaccount.com")
    console.log(`- Client Email Format: ${emailFormat ? "✅ Valid" : "❌ Invalid"}`)

    // Check project ID consistency
    const serverProjectId = process.env.FIREBASE_PROJECT_ID
    const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const projectIdsMatch = serverProjectId === clientProjectId
    console.log(`- Project ID Consistency: ${projectIdsMatch ? "✅ Match" : "⚠️ Mismatch"}`)
  } else {
    console.log("- ❌ Missing Firebase server credentials")
  }

  // Check client-side Firebase config
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    console.log("- ✅ Firebase client credentials present")

    const authDomainFormat = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes(".firebaseapp.com")
    console.log(`- Auth Domain Format: ${authDomainFormat ? "✅ Valid" : "❌ Invalid"}`)
  } else {
    console.log("- ❌ Missing Firebase client credentials")
  }
} catch (error) {
  console.log(`- ❌ Error checking Firebase config: ${error.message}`)
}

// Test Next.js Configuration
console.log("\n⚡ Testing Next.js Configuration:")
console.log(`- NODE_ENV: ${process.env.NODE_ENV || "not set"}`)
console.log(`- VERCEL_URL: ${process.env.VERCEL_URL || "not set (normal for local dev)"}`)

// Check for other important environment variables
console.log("\n🔧 Additional Configuration:")
const additionalVars = ["NEXT_PUBLIC_APP_URL", "BLOB_READ_WRITE_TOKEN", "DEBUG_TOKEN"]

additionalVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅ SET" : "❌ MISSING"
  console.log(`- ${varName}: ${status}`)
})

// Summary
console.log("\n📊 Summary:")
console.log("=".repeat(50))

if (allEnvVarsPresent) {
  console.log("🎉 All critical environment variables are configured!")
} else {
  console.log(`⚠️  ${criticalMissing.length} critical environment variables missing:`)
  criticalMissing.forEach((key) => console.log(`   - ${key}`))
}

// Recommendations
console.log("\n💡 Recommendations:")
if (criticalMissing.length > 0) {
  console.log("1. Add missing environment variables in Vercel Dashboard")
  console.log("2. Redeploy the application after adding variables")
  console.log("3. Check that variable names match exactly (case-sensitive)")
}

if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_")) {
  console.log("4. Verify Stripe Secret Key format (should start with 'sk_')")
}

if (!process.env.FIREBASE_PRIVATE_KEY?.includes("-----BEGIN PRIVATE KEY-----")) {
  console.log("5. Ensure Firebase Private Key includes proper headers and newlines")
}

// Check for common issues
console.log("\n🔍 Common Issues Check:")
if (process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes("\\n")) {
  console.log("⚠️  Firebase Private Key might need proper newline characters (\\n)")
}

if (process.env.STRIPE_SECRET_KEY?.includes("_test_") && process.env.NODE_ENV === "production") {
  console.log("⚠️  Using test Stripe keys in production environment")
}

console.log("\n🔗 Next Steps:")
console.log("- If all variables are set, test the API endpoints")
console.log("- Check API routes are working: /api/debug-stripe")
console.log("- Test Firebase connection: /api/debug-firestore")
console.log("- Verify Stripe webhook endpoint is configured")

console.log("\n✅ Environment check complete!")

// Exit with appropriate code
if (criticalMissing.length > 0) {
  console.log("\n❌ Exiting with error due to missing critical variables")
  process.exit(1)
} else {
  console.log("\n✅ All checks passed!")
  process.exit(0)
}
