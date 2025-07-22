const fs = require("fs")
const path = require("path")

console.log("🔍 Running prebuild checks...")

// Check for conflicting lockfiles
const rootDir = process.cwd()
const pnpmLock = path.join(rootDir, "pnpm-lock.yaml")
const npmLock = path.join(rootDir, "package-lock.json")

if (fs.existsSync(pnpmLock)) {
  console.log("⚠️  Found pnpm-lock.yaml - removing to prevent conflicts")
  fs.unlinkSync(pnpmLock)
}

if (!fs.existsSync(npmLock)) {
  console.log("⚠️  No package-lock.json found - this will be created during npm install")
}

// Check environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
]

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.log("⚠️  Missing environment variables:", missingEnvVars.join(", "))
} else {
  console.log("✅ All required environment variables are present")
}

console.log("✅ Prebuild checks completed")
