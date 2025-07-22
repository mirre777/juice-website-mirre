#!/usr/bin/env node

const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔍 Running prebuild dependency check...")

try {
  // Check if pnpm-lock.yaml exists and remove it
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("⚠️  Found pnpm-lock.yaml, removing it...")
    fs.unlinkSync("pnpm-lock.yaml")

    // If package-lock.json doesn't exist, create it
    if (!fs.existsSync("package-lock.json")) {
      console.log("📦 Generating package-lock.json...")
      execSync("npm install --package-lock-only", { stdio: "inherit" })
    }
  }

  // Verify node_modules exists and is valid
  if (!fs.existsSync("node_modules")) {
    console.log("📦 node_modules not found, installing dependencies...")
    execSync("npm install", { stdio: "inherit" })
  } else {
    console.log("✅ Dependencies look good")
  }

  console.log("✅ Prebuild check completed successfully")
} catch (error) {
  console.error("❌ Prebuild check failed:", error.message)
  console.log("🔧 Attempting to fix by reinstalling dependencies...")

  try {
    // Clean install as fallback
    if (fs.existsSync("node_modules")) {
      execSync("rm -rf node_modules", { stdio: "inherit" })
    }
    if (fs.existsSync("pnpm-lock.yaml")) {
      fs.unlinkSync("pnpm-lock.yaml")
    }
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependencies fixed successfully")
  } catch (fixError) {
    console.error("❌ Could not fix dependencies:", fixError.message)
    process.exit(1)
  }
}
