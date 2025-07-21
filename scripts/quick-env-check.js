// Quick Environment Check - Just shows missing vars
console.log("🔍 QUICK ENVIRONMENT CHECK\n")

const critical = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
]

const missing = []
const present = []

critical.forEach((key) => {
  const value = process.env[key]
  if (!value || value.trim() === "") {
    missing.push(key)
    console.log(`❌ ${key}`)
  } else {
    present.push(key)
    console.log(`✅ ${key}`)
  }
})

console.log(`\n📊 Result: ${present.length}/${critical.length} critical variables present`)

if (missing.length > 0) {
  console.log(`\n❌ Missing ${missing.length} variables:`)
  missing.forEach((key) => console.log(`   - ${key}`))
  process.exit(1)
} else {
  console.log("\n🎉 All critical environment variables are present!")
  process.exit(0)
}
