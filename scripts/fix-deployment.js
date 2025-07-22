#!/usr/bin/env node

const fs = require("fs")
const { execSync } = require("child_process")

console.log("🔧 Fixing deployment issues...")

try {
  // Step 1: Remove pnpm-lock.yaml if it exists
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("🗑️  Removing pnpm-lock.yaml...")
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ Removed pnpm-lock.yaml")
  } else {
    console.log("ℹ️  No pnpm-lock.yaml found")
  }

  // Step 2: Remove node_modules for clean install
  if (fs.existsSync("node_modules")) {
    console.log("🧹 Cleaning node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ Cleaned node_modules")
  }

  // Step 3: Remove existing package-lock.json if it exists
  if (fs.existsSync("package-lock.json")) {
    console.log("🔄 Removing existing package-lock.json for fresh install...")
    fs.unlinkSync("package-lock.json")
  }

  // Step 4: Install dependencies with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed with npm")

  // Step 5: Verify package-lock.json was created
  if (fs.existsSync("package-lock.json")) {
    console.log("✅ package-lock.json created successfully")
  } else {
    throw new Error("package-lock.json was not created")
  }

  console.log("🎉 Deployment fix completed successfully!")
  console.log("📝 Next steps:")
  console.log("   1. Commit the changes")
  console.log("   2. Push to trigger deployment")
  console.log("   3. Vercel will now use npm for builds")
} catch (error) {
  console.error("❌ Fix failed:", error.message)
  console.log("🔧 Manual steps to fix:")
  console.log("   1. Delete pnpm-lock.yaml: rm pnpm-lock.yaml")
  console.log("   2. Delete node_modules: rm -rf node_modules")
  console.log("   3. Install with npm: npm install")
  console.log("   4. Commit and push changes")
  process.exit(1)
}
