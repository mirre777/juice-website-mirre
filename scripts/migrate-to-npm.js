#!/usr/bin/env node

const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

console.log("🔄 Migrating from pnpm to npm...")

try {
  // Remove pnpm lockfile
  if (fs.existsSync("pnpm-lock.yaml")) {
    console.log("🗑️  Removing pnpm-lock.yaml...")
    fs.unlinkSync("pnpm-lock.yaml")
  }

  // Remove node_modules
  if (fs.existsSync("node_modules")) {
    console.log("🗑️  Removing node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
  }

  // Install with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })

  // Update package.json scripts if needed
  const packageJsonPath = path.join(process.cwd(), "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // Ensure we have npm-friendly scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    build: "next build",
    dev: "next dev",
    start: "next start",
    lint: "next lint",
    postinstall: "echo 'Dependencies installed successfully'",
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log("✅ Updated package.json scripts")

  console.log("✅ Migration completed successfully!")
  console.log("📝 Next steps:")
  console.log('   1. Commit the changes: git add . && git commit -m "migrate: switch from pnpm to npm"')
  console.log("   2. Push to trigger new deployment: git push")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  process.exit(1)
}
