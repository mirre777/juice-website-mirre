#!/usr/bin/env node

const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔍 Running prebuild checks...")

// Check for pnpm lockfile and remove it
if (fs.existsSync("pnpm-lock.yaml")) {
  console.log("⚠️  Found pnpm-lock.yaml, removing...")
  fs.unlinkSync("pnpm-lock.yaml")
  console.log("✅ Removed pnpm-lock.yaml")
}

// Ensure package-lock.json exists
if (!fs.existsSync("package-lock.json")) {
  console.log("📦 package-lock.json not found, generating...")
  try {
    execSync("npm install --package-lock-only", { stdio: "inherit" })
    console.log("✅ Generated package-lock.json")
  } catch (error) {
    console.error("❌ Failed to generate package-lock.json:", error.message)
  }
}

// Verify dependencies are installed
if (!fs.existsSync("node_modules")) {
  console.log("📦 node_modules not found, installing dependencies...")
  try {
    execSync("npm ci", { stdio: "inherit" })
    console.log("✅ Dependencies installed")
  } catch (error) {
    console.log("⚠️  npm ci failed, trying npm install...")
    try {
      execSync("npm install", { stdio: "inherit" })
      console.log("✅ Dependencies installed with npm install")
    } catch (installError) {
      console.error("❌ Failed to install dependencies:", installError.message)
      process.exit(1)
    }
  }
}

console.log("✅ Prebuild checks completed successfully")
