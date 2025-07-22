#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔍 Running prebuild checks...")

// Check for pnpm-lock.yaml and remove it
if (fs.existsSync("pnpm-lock.yaml")) {
  console.log("⚠️  Found pnpm-lock.yaml, removing...")
  fs.unlinkSync("pnpm-lock.yaml")
  console.log("✅ Removed pnpm-lock.yaml")
}

// Check for .pnpmfile.cjs and remove it
if (fs.existsSync(".pnpmfile.cjs")) {
  console.log("⚠️  Found .pnpmfile.cjs, removing...")
  fs.unlinkSync(".pnpmfile.cjs")
  console.log("✅ Removed .pnpmfile.cjs")
}

// Remove existing package-lock.json for clean install
if (fs.existsSync("package-lock.json")) {
  console.log("🔄 Removing existing package-lock.json for clean install...")
  fs.unlinkSync("package-lock.json")
}

// Clean node_modules
if (fs.existsSync("node_modules")) {
  console.log("🧹 Cleaning node_modules...")
  execSync("rm -rf node_modules", { stdio: "inherit" })
}

// Install dependencies with npm
console.log("📦 Installing dependencies with npm...")
try {
  execSync("npm install --force", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message)
  process.exit(1)
}

// Verify package-lock.json was created
if (fs.existsSync("package-lock.json")) {
  console.log("✅ package-lock.json created successfully")
} else {
  console.log("⚠️  package-lock.json not found after npm install")
}

console.log("✅ Prebuild checks completed successfully")
