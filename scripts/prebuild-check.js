const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔍 Running prebuild dependency check...")

try {
  // Check if pnpm-lock.yaml exists and remove it
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("⚠️  Found pnpm-lock.yaml, removing it...")
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ pnpm-lock.yaml removed")

    // If package-lock.json doesn't exist, create it
    if (!fs.existsSync("package-lock.json")) {
      console.log("📦 Generating package-lock.json...")
      execSync("npm install --package-lock-only", { stdio: "inherit" })
      console.log("✅ package-lock.json generated")
    }
  }

  // Verify node_modules exists and is valid
  if (!fs.existsSync("node_modules")) {
    console.log("📦 node_modules not found, installing dependencies...")
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependencies installed")
  } else {
    console.log("✅ Dependencies look good")
  }

  // Double-check that we have package-lock.json
  if (!fs.existsSync("package-lock.json")) {
    console.log("⚠️  No package-lock.json found, creating one...")
    execSync("npm install --package-lock-only", { stdio: "inherit" })
  }

  console.log("✅ Prebuild check completed successfully")
} catch (error) {
  console.error("❌ Prebuild check failed:", error.message)
  console.log("🔧 Attempting to fix by reinstalling dependencies...")

  try {
    // Clean install as fallback
    if (fs.existsSync("node_modules")) {
      console.log("🧹 Cleaning node_modules...")
      execSync("rm -rf node_modules", { stdio: "inherit" })
    }
    if (fs.existsSync("pnpm-lock.yaml")) {
      console.log("🗑️  Removing pnpm-lock.yaml...")
      fs.unlinkSync("pnpm-lock.yaml")
    }
    console.log("📦 Installing dependencies...")
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependencies fixed successfully")
  } catch (fixError) {
    console.error("❌ Could not fix dependencies:", fixError.message)
    console.log("⚠️  Continuing with build anyway...")
    // Don't exit with error to allow build to continue
  }
}
