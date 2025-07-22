const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔧 Fixing deployment configuration...")

try {
  // Remove problematic lockfiles
  const filesToRemove = ["pnpm-lock.yaml", "yarn.lock"]

  filesToRemove.forEach((file) => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`✅ Removed ${file}`)
    }
  })

  // Clean node_modules
  const nodeModulesPath = path.join(process.cwd(), "node_modules")
  if (fs.existsSync(nodeModulesPath)) {
    console.log("🧹 Cleaning node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ Cleaned node_modules")
  }

  // Install with npm to create package-lock.json
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Created package-lock.json")

  // Verify package-lock.json exists
  const packageLockPath = path.join(process.cwd(), "package-lock.json")
  if (fs.existsSync(packageLockPath)) {
    console.log("✅ package-lock.json verified")
  } else {
    throw new Error("package-lock.json was not created")
  }

  console.log("🎉 Deployment fix completed successfully!")
  console.log("📝 Next steps:")
  console.log("   1. Commit the new package-lock.json")
  console.log("   2. Remove pnpm-lock.yaml from git if it exists")
  console.log("   3. Push changes to trigger deployment")
} catch (error) {
  console.error("❌ Fix failed:", error.message)
  process.exit(1)
}
