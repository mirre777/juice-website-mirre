#!/usr/bin/env node

/**
 * Script to fix pnpm lockfile synchronization issues
 * Run this locally to regenerate the lockfile
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔧 Fixing pnpm lockfile synchronization...")

try {
  // Check if pnpm-lock.yaml exists
  const lockfilePath = path.join(process.cwd(), "pnpm-lock.yaml")

  if (fs.existsSync(lockfilePath)) {
    console.log("📁 Removing existing pnpm-lock.yaml...")
    fs.unlinkSync(lockfilePath)
  }

  // Check if node_modules exists and remove it
  const nodeModulesPath = path.join(process.cwd(), "node_modules")
  if (fs.existsSync(nodeModulesPath)) {
    console.log("📁 Removing node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
  }

  // Reinstall dependencies to generate fresh lockfile
  console.log("📦 Installing dependencies with pnpm...")
  execSync("pnpm install", { stdio: "inherit" })

  console.log("✅ Lockfile synchronization complete!")
  console.log("📝 Please commit the updated pnpm-lock.yaml file")
} catch (error) {
  console.error("❌ Error fixing lockfile:", error.message)
  process.exit(1)
}
