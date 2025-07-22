const fs = require("fs")

console.log("🧹 Cleaning up pnpm files...")

// Remove pnpm-lock.yaml if it exists
if (fs.existsSync("pnpm-lock.yaml")) {
  fs.unlinkSync("pnpm-lock.yaml")
  console.log("✅ Removed pnpm-lock.yaml")
} else {
  console.log("ℹ️  No pnpm-lock.yaml found")
}

// Remove .pnpm folder if it exists
if (fs.existsSync(".pnpm")) {
  fs.rmSync(".pnpm", { recursive: true, force: true })
  console.log("✅ Removed .pnpm folder")
} else {
  console.log("ℹ️  No .pnpm folder found")
}

// Remove pnpm-workspace.yaml if it exists
if (fs.existsSync("pnpm-workspace.yaml")) {
  fs.unlinkSync("pnpm-workspace.yaml")
  console.log("✅ Removed pnpm-workspace.yaml")
}

console.log("🎯 Migration preparation complete!")
console.log("📋 The prebuild script will handle the rest during deployment.")
