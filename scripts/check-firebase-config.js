// Check Firebase Configuration Script
console.log("🔥 Firebase Configuration Check\n")

// Check environment variables
const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

const serverVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
]

console.log("📋 Client-side Environment Variables (NEXT_PUBLIC_*):")
let clientConfigured = true
requiredVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅ SET" : "❌ MISSING"
  const displayValue = value ? (value.length > 20 ? value.substring(0, 20) + "..." : value) : "undefined"
  console.log(`  ${varName}: ${status} ${value ? `(${displayValue})` : ""}`)
  if (!value) clientConfigured = false
})

console.log("\n📋 Server-side Environment Variables:")
let serverConfigured = true
serverVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅ SET" : "❌ MISSING"
  const displayValue = value ? (value.length > 20 ? value.substring(0, 20) + "..." : value) : "undefined"
  console.log(`  ${varName}: ${status} ${value ? `(${displayValue})` : ""}`)
  if (!value) serverConfigured = false
})

console.log("\n🎯 Configuration Status:")
console.log(`  Client-side Firebase: ${clientConfigured ? "✅ CONFIGURED" : "❌ NOT CONFIGURED"}`)
console.log(`  Server-side Firebase: ${serverConfigured ? "✅ CONFIGURED" : "❌ NOT CONFIGURED"}`)

if (!clientConfigured || !serverConfigured) {
  console.log("\n⚠️  Firebase Configuration Issues Detected!")
  console.log("\n📝 To fix this, add the following environment variables:")
  console.log("\n# Client-side (required for browser components)")
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.log(`${varName}=your_value_here`)
    }
  })
  console.log("\n# Server-side (optional, for admin operations)")
  serverVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.log(`${varName}=your_value_here`)
    }
  })
  console.log("\n🔗 Get these values from: https://console.firebase.google.com")
  console.log("   → Project Settings → General → Your apps → Web app config")
} else {
  console.log("\n🎉 Firebase is properly configured!")
}

console.log("\n💡 Note: The system works in mock mode when Firebase is not configured.")
console.log("   This is expected behavior for development and testing.")
