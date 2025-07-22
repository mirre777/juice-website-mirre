#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

console.log("🔍 Running prebuild checks...")

// Remove pnmp-lock.yaml if it exists (typo version)
const pnmpLockPath = path.join(process.cwd(), "pnmp-lock.yaml")
if (fs.existsSync(pnmpLockPath)) {
  console.log("🗑️  Removing pnmp-lock.yaml (typo version)")
  fs.unlinkSync(pnmpLockPath)
}

// Remove pnpm-lock.yaml if it exists
const pnpmLockPath = path.join(process.cwd(), "pnpm-lock.yaml")
if (fs.existsSync(pnpmLockPath)) {
  console.log("🗑️  Removing pnpm-lock.yaml")
  fs.unlinkSync(pnpmLockPath)
}

// Remove yarn.lock if it exists
const yarnLockPath = path.join(process.cwd(), "yarn.lock")
if (fs.existsSync(yarnLockPath)) {
  console.log("🗑️  Removing yarn.lock")
  fs.unlinkSync(yarnLockPath)
}

console.log("✅ Prebuild checks complete - using npm only")
