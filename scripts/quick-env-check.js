#!/usr/bin/env node

console.log("⚡ Quick Environment Check\n")

// Critical environment variables only
const CRITICAL_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
]

let allPresent = true
const missing = []

CRITICAL_VARS.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅" : "❌"

  console.log(`${status} ${varName}`)

  if (!value) {
    missing.push(varName)
    allPresent = false
  }
})

console.log("\n" + "=".repeat(50))

if (allPresent) {
  console.log("🎉 All critical environment variables are present!")
} else {
  console.log(`❌ Missing ${missing.length} critical variables:`)
  missing.forEach((name) => console.log(`   - ${name}`))
  console.log("\nAdd these to Vercel Dashboard > Settings > Environment Variables")
}

process.exit(allPresent ? 0 : 1)
