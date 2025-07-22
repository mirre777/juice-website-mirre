const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

console.log("🔄 Starting migration from pnpm to npm...")

try {
  // Check if pnpm-lock.yaml exists
  const pnpmLockPath = path.join(process.cwd(), "pnpm-lock.yaml")
  const packageLockPath = path.join(process.cwd(), "package-lock.json")
  const nodeModulesPath = path.join(process.cwd(), "node_modules")

  // Remove pnpm lockfile if it exists
  if (fs.existsSync(pnpmLockPath)) {
    console.log("🗑️  Removing pnpm-lock.yaml...")
    fs.unlinkSync(pnpmLockPath)
    console.log("✅ pnpm-lock.yaml removed")
  } else {
    console.log("ℹ️  No pnpm-lock.yaml found")
  }

  // Remove node_modules to ensure clean install
  if (fs.existsSync(nodeModulesPath)) {
    console.log("🗑️  Removing node_modules...")
    execSync("rm -rf node_modules", { stdio: "inherit" })
    console.log("✅ node_modules removed")
  }

  // Remove existing package-lock.json if it exists
  if (fs.existsSync(packageLockPath)) {
    console.log("🗑️  Removing existing package-lock.json...")
    fs.unlinkSync(packageLockPath)
    console.log("✅ existing package-lock.json removed")
  }

  // Install dependencies with npm
  console.log("📦 Installing dependencies with npm...")
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed with npm")

  // Verify package-lock.json was created
  if (fs.existsSync(packageLockPath)) {
    console.log("✅ package-lock.json created successfully")
  } else {
    throw new Error("package-lock.json was not created")
  }

  // Update package.json scripts if they reference pnpm
  const packageJsonPath = path.join(process.cwd(), "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  let scriptsUpdated = false
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach((key) => {
      if (packageJson.scripts[key].includes("pnpm")) {
        packageJson.scripts[key] = packageJson.scripts[key].replace(/pnpm/g, "npm")
        scriptsUpdated = true
      }
    })
  }

  if (scriptsUpdated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("📝 Updated package.json scripts to use npm")
  }

  console.log("🎉 Migration completed successfully!")
  console.log("📝 Next steps:")
  console.log("   1. Commit the new package-lock.json file")
  console.log("   2. Push to your repository")
  console.log("   3. Vercel will now use npm for deployments")
} catch (error) {
  console.error("❌ Migration failed:", error.message)
  console.log("🔧 Manual steps to fix:")
  console.log("   1. Delete pnpm-lock.yaml if it exists")
  console.log("   2. Delete node_modules folder")
  console.log("   3. Run 'npm install'")
  console.log("   4. Commit and push changes")
  process.exit(1)
}
