#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔄 Starting migration from pnpm to npm...")

// Remove pnpm files
const filesToRemove = ["pnpm-lock.yaml", ".pnpmfile.cjs", ".pnpm-debug.log"]

filesToRemove.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`✅ Removed ${file}`)
  }
})

// Remove pnpm from package.json scripts
const packageJsonPath = "package.json"
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // Update scripts to use npm instead of pnpm
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((key) => {
      if (packageJson.scripts[key].includes("pnpm")) {
        packageJson.scripts[key] = packageJson.scripts[key].replace(/pnpm/g, "npm")
        console.log(`✅ Updated script "${key}" to use npm`)
      }
    })
  }

  // Remove pnpm-specific fields
  delete packageJson.pnpm
  delete packageJson.packageManager

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ Updated package.json")
}

// Install dependencies with npm
try {
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message)
  process.exit(1)
}

console.log("🎉 Migration to npm completed successfully!")
