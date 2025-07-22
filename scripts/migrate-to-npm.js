const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

console.log("🚀 Starting migration from pnpm to npm...")

try {
  // Remove pnpm-lock.yaml if it exists
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("🗑️  Removing pnpm-lock.yaml...")
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ pnpm-lock.yaml removed")
  }

  // Remove node_modules to ensure clean state
  if (fs.existsSync("node_modules")) {
    console.log("🧹 Cleaning node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ node_modules cleaned")
  }

  // Remove any existing package-lock.json to regenerate it
  if (fs.existsSync("package-lock.json")) {
    console.log("🔄 Removing existing package-lock.json...")
    fs.unlinkSync("package-lock.json")
  }

  // Install dependencies with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")

  // Verify package-lock.json was created
  if (fs.existsSync("package-lock.json")) {
    console.log("✅ package-lock.json created successfully")
  } else {
    console.log("⚠️  package-lock.json not found, creating it...")
    execSync("npm install --package-lock-only", { stdio: "inherit" })
  }

  console.log("🎉 Migration to npm completed successfully!")
  console.log("📝 Next steps:")
  console.log("   1. Commit the new package-lock.json")
  console.log("   2. Push to your repository")
  console.log("   3. Vercel will use npm for all future deployments")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  console.log("🔧 Please run this script manually or contact support")
  process.exit(1)
}
