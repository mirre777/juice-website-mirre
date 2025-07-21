#!/usr/bin/env node

console.log("🔬 Complete Environment Test\n")
console.log("=".repeat(70))

// Environment Variables Check
console.log("1️⃣  CHECKING ENVIRONMENT VARIABLES...")

const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
]

let envVarsPresent = 0
const envVarsTotal = requiredVars.length

requiredVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅" : "❌"
  console.log(`   ${status} ${varName}`)
  if (value) envVarsPresent++
})

const envVarsPass = envVarsPresent === envVarsTotal

console.log(`   Result: ${envVarsPresent}/${envVarsTotal} variables present`)
console.log(`   Status: ${envVarsPass ? "✅ PASS" : "❌ FAIL"}`)

// Configuration Check
console.log("\n2️⃣  CHECKING CONFIGURATION...")

let configChecks = 0
const configTotal = 3

// Check Stripe keys format
const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripePublic = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET

if (stripeSecret && stripeSecret.startsWith("sk_")) {
  console.log("   ✅ Stripe Secret Key format valid")
  configChecks++
} else {
  console.log("   ❌ Stripe Secret Key invalid or missing")
}

if (stripePublic && stripePublic.startsWith("pk_")) {
  console.log("   ✅ Stripe Publishable Key format valid")
  configChecks++
} else {
  console.log("   ❌ Stripe Publishable Key invalid or missing")
}

// Check Firebase private key
const firebaseKey = process.env.FIREBASE_PRIVATE_KEY
if (firebaseKey && firebaseKey.includes("BEGIN PRIVATE KEY")) {
  console.log("   ✅ Firebase Private Key format valid")
  configChecks++
} else {
  console.log("   ❌ Firebase Private Key invalid or missing")
}

const configPass = configChecks === configTotal
console.log(`   Result: ${configChecks}/${configTotal} configurations valid`)
console.log(`   Status: ${configPass ? "✅ PASS" : "❌ FAIL"}`)

// API Endpoints Check (simplified)
console.log("\n3️⃣  CHECKING API ENDPOINTS...")
console.log("   ⚠️  API endpoint testing requires running server")
console.log("   ℹ️  Skipping endpoint tests in this environment")
console.log("   Status: ⚠️  SKIPPED")

// Overall Summary
console.log("\n" + "=".repeat(70))
console.log("📊 OVERALL SUMMARY")
console.log("=".repeat(70))

const overallPass = envVarsPass && configPass

console.log(`Environment Variables: ${envVarsPass ? "✅ PASS" : "❌ FAIL"}`)
console.log(`Configuration: ${configPass ? "✅ PASS" : "❌ FAIL"}`)
console.log(`API Endpoints: ⚠️  SKIPPED`)

console.log("=".repeat(70))

if (overallPass) {
  console.log("🎉 ENVIRONMENT SETUP IS READY!")
  console.log("\n✅ Your application should work correctly with:")
  console.log("   - Firebase authentication and database")
  console.log("   - Stripe payment processing")
  console.log("   - Trainer profile system")
} else {
  console.log("❌ SOME TESTS FAILED. Check the details above.")

  if (!envVarsPass) {
    console.log("\n🔧 To fix environment variables:")
    console.log("1. Go to Vercel Dashboard > Project > Settings > Environment Variables")
    console.log("2. Add the missing variables listed above")
    console.log("3. Redeploy the application")
  }

  if (!configPass) {
    console.log("\n🔧 To fix configuration:")
    console.log("1. Verify Stripe keys start with 'sk_' and 'pk_'")
    console.log("2. Ensure Firebase private key includes BEGIN PRIVATE KEY markers")
    console.log("3. Check Firebase service account email format")
  }
}

process.exit(overallPass ? 0 : 1)
