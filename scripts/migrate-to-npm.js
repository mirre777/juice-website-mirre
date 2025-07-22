const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔄 Migrating project to npm...")

const rootDir = process.cwd()

// Remove pnpm and yarn lockfiles
const lockfilesToRemove = [
  "pnpm-lock.yaml",
  "pnmp-lock.yaml", // Common typo
  "yarn.lock",
]

lockfilesToRemove.forEach((lockfile) => {
  const lockfilePath = path.join(rootDir, lockfile)
  if (fs.existsSync(lockfilePath)) {
    console.log(`🗑️  Removing ${lockfile}`)
    fs.unlinkSync(lockfilePath)
  }
})

// Clean node_modules
const nodeModulesPath = path.join(rootDir, "node_modules")
if (fs.existsSync(nodeModulesPath)) {
  console.log("🧹 Cleaning node_modules directory...")
  fs.rmSync(nodeModulesPath, { recursive: true, force: true })
}

// Install with npm
console.log("📦 Installing dependencies with npm...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Migration to npm completed successfully!")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  process.exit(1)
}
