const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔧 Fixing deployment configuration...")

const rootDir = process.cwd()
const pnpmLock = path.join(rootDir, "pnmp-lock.yaml")
const pnpmLockCorrect = path.join(rootDir, "pnpm-lock.yaml")
const yarnLock = path.join(rootDir, "yarn.lock")

// Remove any existing lockfiles that might cause conflicts
;[pnpmLock, pnpmLockCorrect, yarnLock].forEach((lockFile) => {
  if (fs.existsSync(lockFile)) {
    console.log(`🗑️  Removing ${path.basename(lockFile)}`)
    fs.unlinkSync(lockFile)
  }
})

// Clean node_modules
const nodeModules = path.join(rootDir, "node_modules")
if (fs.existsSync(nodeModules)) {
  console.log("🧹 Cleaning node_modules...")
  fs.rmSync(nodeModules, { recursive: true, force: true })
}

// Install with npm
console.log("📦 Installing dependencies with npm...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully")
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message)
  process.exit(1)
}

console.log("🚀 Deployment fix completed!")
