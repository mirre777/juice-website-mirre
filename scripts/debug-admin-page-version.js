const fs = require("fs")
const path = require("path")

console.log("🔍 Debugging Admin Page Version...\n")

// Check if we're in the right directory structure
const possiblePaths = [
  "app/admin/user-management/page.tsx",
  "./app/admin/user-management/page.tsx",
  "src/app/admin/user-management/page.tsx",
  "./src/app/admin/user-management/page.tsx",
]

console.log("📁 Checking file system...")

let foundFile = null
let fileContent = null

for (const filePath of possiblePaths) {
  try {
    if (fs.existsSync(filePath)) {
      foundFile = filePath
      fileContent = fs.readFileSync(filePath, "utf8")
      console.log(`✅ Found file at: ${filePath}`)
      break
    }
  } catch (error) {
    // Continue checking other paths
  }
}

if (!foundFile) {
  console.log("❌ Admin page file not found in any expected location")
  console.log("🔍 Checking current directory structure...")

  try {
    const currentDir = process.cwd()
    console.log(`📂 Current directory: ${currentDir}`)

    // List contents of current directory
    const contents = fs.readdirSync(".")
    console.log("📋 Directory contents:", contents)

    // Check if app directory exists
    if (contents.includes("app")) {
      console.log("📁 Found app directory, checking contents...")
      const appContents = fs.readdirSync("app")
      console.log("📋 App directory contents:", appContents)

      if (appContents.includes("admin")) {
        console.log("📁 Found admin directory, checking contents...")
        const adminContents = fs.readdirSync("app/admin")
        console.log("📋 Admin directory contents:", adminContents)
      }
    }
  } catch (error) {
    console.log("❌ Error reading directory structure:", error.message)
  }
} else {
  console.log("\n🔍 Analyzing file content...")

  // Check for enhanced features
  const enhancedFeatures = [
    "getGoalBadge",
    "getStartTimeBadge",
    "getSourceBadge",
    "User Info",
    "Contact",
    "Location",
    "Goal",
    "Start Time",
    "Statistics Cards",
    "uniqueCities",
    "filterCity",
  ]

  const foundFeatures = enhancedFeatures.filter((feature) => fileContent.includes(feature))

  console.log(`✅ Enhanced features found: ${foundFeatures.length}/${enhancedFeatures.length}`)
  foundFeatures.forEach((feature) => console.log(`  ✓ ${feature}`))

  const missingFeatures = enhancedFeatures.filter((feature) => !fileContent.includes(feature))

  if (missingFeatures.length > 0) {
    console.log(`❌ Missing features: ${missingFeatures.length}`)
    missingFeatures.forEach((feature) => console.log(`  ✗ ${feature}`))
  }

  // Check file size and modification time
  const stats = fs.statSync(foundFile)
  console.log(`📊 File size: ${stats.size} bytes`)
  console.log(`📅 Last modified: ${stats.mtime}`)

  // Check for old basic table structure
  const oldFeatures = [
    "Waitlist Users",
    "potential_users",
    "Email</th>",
    "User Type</th>",
    "Status</th>",
    "Created At</th>",
    "Actions</th>",
  ]

  const foundOldFeatures = oldFeatures.filter((feature) => fileContent.includes(feature))

  if (foundOldFeatures.length > 0) {
    console.log(`⚠️  Old table structure detected: ${foundOldFeatures.length} old features found`)
    foundOldFeatures.forEach((feature) => console.log(`  ! ${feature}`))
  }
}

// Check package.json for Next.js version
console.log("\n📦 Checking Next.js version...")
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next
  console.log(`⚡ Next.js version: ${nextVersion || "Not found"}`)
} catch (error) {
  console.log("❌ Could not read package.json")
}

// Check build status
console.log("\n🏗️ Checking build status...")
if (fs.existsSync(".next")) {
  console.log("✅ .next build directory exists")
  try {
    const buildId = fs.readFileSync(".next/BUILD_ID", "utf8").trim()
    console.log(`🆔 Build ID: ${buildId}`)
  } catch (error) {
    console.log("⚠️  Could not read BUILD_ID")
  }
} else {
  console.log("❌ No .next build directory found")
  console.log("💡 Try: npm run build")
}

// Environment check
console.log("\n🌍 Environment check...")
console.log(`NODE_ENV: ${process.env.NODE_ENV || "not set"}`)
console.log(`Current directory: ${process.cwd()}`)

// Recommendations
console.log("\n🎯 RECOMMENDATIONS:")
console.log("1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)")
console.log("2. Clear browser cache")
console.log("3. Delete .next folder and rebuild: rm -rf .next && npm run build")
console.log("4. Check browser dev tools Network tab for 304 responses")
console.log("5. Try incognito/private browsing mode")

if (!foundFile) {
  console.log("6. The admin page file is missing - this explains why changes aren't showing")
  console.log("7. Check if the file exists in your actual project repository")
  console.log("8. Verify the file was properly saved/committed")
}

console.log("\n✅ Debug complete!")
