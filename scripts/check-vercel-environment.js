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
  STRIPE_PUBLISHABLE_KEY: "Stripe Publishable Key",

  // Firebase Configuration
  FIREBASE_PROJECT_ID: "Firebase Project ID",
  FIREBASE_CLIENT_EMAIL: "Firebase Client Email",
  FIREBASE_PRIVATE_KEY: "Firebase Private Key",

  // Next.js Configuration
  NEXTAUTH_SECRET: "NextAuth Secret",
  NEXTAUTH_URL: "NextAuth URL",

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

  console.log(`${key.padEnd(25)} | ${status} | ${description}`)

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
  } else {
    console.log("- ❌ Stripe Secret Key not found")
  }

  if (process.env.STRIPE_PUBLISHABLE_KEY) {
    const pubKeyFormat = process.env.STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
    console.log(`- Publishable Key Format: ${pubKeyFormat ? "✅ Valid" : "❌ Invalid"}`)
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
    console.log("- ✅ All Firebase credentials present")

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
  } else {
    console.log("- ❌ Missing Firebase credentials")
  }
} catch (error) {
  console.log(`- ❌ Error checking Firebase config: ${error.message}`)
}

// Test Next.js Configuration
console.log("\n⚡ Testing Next.js Configuration:")
console.log(`- NODE_ENV: ${process.env.NODE_ENV || "not set"}`)
console.log(`- VERCEL_URL: ${process.env.VERCEL_URL || "not set (normal for local dev)"}`)
console.log(`- NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "not set"}`)

// Summary
console.log("\n📊 Summary:")
console.log("=".repeat(50))

if (allEnvVarsPresent) {
  console.log("🎉 All environment variables are configured!")
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

console.log("\n🔗 Next Steps:")
console.log("- If all variables are set, test the trainer creation flow")
console.log("- Check API routes are working: /api/stripe-test")
console.log("- Test Firebase connection: /api/debug-firestore")
console.log("- Verify Stripe webhook endpoint is configured")

console.log("\n✅ Environment check complete!")
