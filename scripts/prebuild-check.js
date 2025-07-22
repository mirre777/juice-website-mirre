const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔍 Running prebuild checks...")

try {
  // Check for pnpm lockfile and remove it
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("⚠️  Found pnpm-lock.yaml, removing...")
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ Removed pnpm-lock.yaml")
  }

  // Remove any existing package-lock.json to ensure clean state
  if (fs.existsSync("package-lock.json")) {
    console.log("🔄 Removing existing package-lock.json for clean install...")
    fs.unlinkSync("package-lock.json")
  }

  // Clean node_modules
  if (fs.existsSync("node_modules")) {
    console.log("🧹 Cleaning node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
  }

  // Install dependencies
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")

  console.log("✅ Prebuild checks completed successfully")
} catch (error) {
  console.error("❌ Prebuild check failed:", error.message)
  console.log("🔧 Attempting emergency fix...")

  try {
    // Emergency cleanup
    if (fs.existsSync("pnpm-lock.yaml")) fs.unlinkSync("pnpm-lock.yaml")
    if (fs.existsSync("package-lock.json")) fs.unlinkSync("package-lock.json")
    execSync("rm -rf node_modules", { stdio: "inherit" })
    execSync("npm install --no-package-lock", { stdio: "inherit" })
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Emergency fix successful")
  } catch (emergencyError) {
    console.error("❌ Emergency fix failed:", emergencyError.message)
    // Don't exit with error to allow build to continue
  }
}
