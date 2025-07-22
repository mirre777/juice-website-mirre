#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🚀 Starting migration from pnpm to npm...")

// Step 1: Remove pnpm files
const filesToRemove = ["pnpm-lock.yaml", ".pnpmfile.cjs", ".pnpm-debug.log"]

filesToRemove.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`✅ Removed ${file}`)
  }
})

// Step 2: Remove node_modules for clean install
if (fs.existsSync("node_modules")) {
  console.log("🧹 Removing node_modules...")
  execSync("rm -rf node_modules", { stdio: "inherit" })
}

// Step 3: Remove existing package-lock.json if it exists
if (fs.existsSync("package-lock.json")) {
  fs.unlinkSync("package-lock.json")
  console.log("✅ Removed existing package-lock.json")
}

// Step 4: Update package.json scripts to use npm
const packageJsonPath = "package.json"
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // Update scripts that might reference pnpm
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((key) => {
      if (packageJson.scripts[key].includes("pnpm")) {
        packageJson.scripts[key] = packageJson.scripts[key].replace(/pnpm/g, "npm")
        console.log(`✅ Updated script "${key}" to use npm`)
      }
    })
  }

  // Remove pnpm-specific fields
  if (packageJson.pnpm) {
    delete packageJson.pnpm
    console.log("✅ Removed pnpm configuration from package.json")
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

// Step 5: Install dependencies with npm
console.log("📦 Installing dependencies with npm...")
try {
  execSync("npm install --force", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully with npm")
} catch (error) {
  console.error("❌ Failed to install dependencies:", error.message)
  process.exit(1)
}

// Step 6: Create .npmrc if needed
const npmrcContent = `
# Use npm registry
registry=https://registry.npmjs.org/
# Disable package-lock for faster installs in CI
package-lock=true
# Enable legacy peer deps to avoid conflicts
legacy-peer-deps=true
`

fs.writeFileSync(".npmrc", npmrcContent.trim())
console.log("✅ Created .npmrc configuration")

console.log("🎉 Migration from pnpm to npm completed successfully!")
console.log("📝 Next steps:")
console.log("   1. Commit the changes")
console.log("   2. Update your CI/CD scripts to use npm instead of pnpm")
console.log("   3. Update documentation to reflect the change")
