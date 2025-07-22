const fs = require("fs")
const { execSync } = require("child_process")

console.log("🚀 Starting migration from pnpm to npm...")

try {
  // Step 1: Remove pnpm files
  console.log("🗑️  Removing pnpm files...")

  if (fs.existsSync("pnpm-lock.yaml")) {
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ Removed pnpm-lock.yaml")
  }

  if (fs.existsSync(".pnpmfile.cjs")) {
    fs.unlinkSync(".pnpmfile.cjs")
    console.log("✅ Removed .pnpmfile.cjs")
  }

  // Step 2: Clean node_modules
  console.log("🧹 Cleaning node_modules...")
  if (fs.existsSync("node_modules")) {
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ Cleaned node_modules")
  }

  // Step 3: Remove existing package-lock.json if it exists
  if (fs.existsSync("package-lock.json")) {
    fs.unlinkSync("package-lock.json")
    console.log("✅ Removed existing package-lock.json")
  }

  // Step 4: Install with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed with npm")

  // Step 5: Update package.json scripts
  console.log("📝 Updating package.json scripts...")
  const packageJsonPath = "package.json"
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

    // Update scripts to use npm
    if (packageJson.scripts) {
      Object.keys(packageJson.scripts).forEach((script) => {
        if (packageJson.scripts[script].includes("pnpm")) {
          packageJson.scripts[script] = packageJson.scripts[script].replace(/pnpm/g, "npm")
        }
      })
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("✅ Updated package.json scripts")
  }

  console.log("🎉 Migration completed successfully!")
  console.log("📋 Summary:")
  console.log("   - Removed pnpm-lock.yaml")
  console.log("   - Cleaned node_modules")
  console.log("   - Installed dependencies with npm")
  console.log("   - Updated package.json scripts")
  console.log("   - Created package-lock.json")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  console.log("🔧 Manual steps required:")
  console.log("   1. Delete pnpm-lock.yaml manually")
  console.log("   2. Delete node_modules folder")
  console.log("   3. Run: npm install")
  process.exit(1)
}
