#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔧 Fixing deployment issues...")

try {
  // Remove conflicting lockfiles
  const lockfilesToRemove = [
    "pnpm-lock.yaml",
    "pnmp-lock.yaml", // Common typo
    "yarn.lock",
  ]

  lockfilesToRemove.forEach((lockfile) => {
    if (fs.existsSync(lockfile)) {
      console.log(`🗑️  Removing ${lockfile}`)
      fs.unlinkSync(lockfile)
    }
  })

  // Clean node_modules
  if (fs.existsSync("node_modules")) {
    console.log("🧹 Cleaning node_modules...")
    fs.rmSync("node_modules", { recursive: true, force: true })
  }

  // Install with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })

  console.log("✅ Deployment fix completed!")
  console.log("📝 Ready to commit and deploy")
} catch (error) {
  console.error("❌ Fix failed:", error.message)
  process.exit(1)
}
