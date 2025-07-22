const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔄 Migrating from pnpm to npm...")

try {
  // Remove pnpm lockfile if it exists
  const pnpmLockPath = path.join(process.cwd(), "pnpm-lock.yaml")
  if (fs.existsSync(pnpmLockPath)) {
    fs.unlinkSync(pnpmLockPath)
    console.log("✅ Removed pnpm-lock.yaml")
  }

  // Remove yarn lockfile if it exists
  const yarnLockPath = path.join(process.cwd(), "yarn.lock")
  if (fs.existsSync(yarnLockPath)) {
    fs.unlinkSync(yarnLockPath)
    console.log("✅ Removed yarn.lock")
  }

  // Remove node_modules
  const nodeModulesPath = path.join(process.cwd(), "node_modules")
  if (fs.existsSync(nodeModulesPath)) {
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ Removed node_modules")
  }

  // Install with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed with npm")

  console.log("🎉 Migration to npm completed successfully!")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  process.exit(1)
}
