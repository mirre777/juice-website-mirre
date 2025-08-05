// Debug script to check what version of the admin page is being served

console.log("🔍 Debugging Admin Page Version...\n")

// Check if we're in the right environment
const fs = require("fs")
const path = require("path")

// 1. Check the actual file content on disk
console.log("📁 Checking file system...")
const adminPagePath = path.join(process.cwd(), "app/admin/user-management/page.tsx")

try {
  if (fs.existsSync(adminPagePath)) {
    const fileContent = fs.readFileSync(adminPagePath, "utf8")

    // Check for key indicators of the enhanced version
    const hasEnhancedTable =
      fileContent.includes("User Info") && fileContent.includes("Contact") && fileContent.includes("Location")
    const hasGoalBadge = fileContent.includes("getGoalBadge")
    const hasStartTimeBadge = fileContent.includes("getStartTimeBadge")
    const hasSourceBadge = fileContent.includes("getSourceBadge")
    const hasStatistics = fileContent.includes("Statistics Cards")
    const hasFilters = fileContent.includes("Filters")

    console.log("✅ File exists at:", adminPagePath)
    console.log("📊 Enhanced table headers:", hasEnhancedTable ? "✅ YES" : "❌ NO")
    console.log("🎯 Goal badge function:", hasGoalBadge ? "✅ YES" : "❌ NO")
    console.log("⏰ Start time badge function:", hasStartTimeBadge ? "✅ YES" : "❌ NO")
    console.log("🌐 Source badge function:", hasSourceBadge ? "✅ YES" : "❌ NO")
    console.log("📈 Statistics cards:", hasStatistics ? "✅ YES" : "❌ NO")
    console.log("🔍 Filter section:", hasFilters ? "✅ YES" : "❌ NO")

    // Check file size and last modified
    const stats = fs.statSync(adminPagePath)
    console.log("📏 File size:", Math.round(stats.size / 1024), "KB")
    console.log("🕐 Last modified:", stats.mtime.toLocaleString())

    // Look for the old basic table structure
    const hasOldTable = fileContent.includes("Waitlist Users") && !hasEnhancedTable
    console.log("🗂️ Old basic table structure:", hasOldTable ? "⚠️ YES (PROBLEM!)" : "✅ NO")

    if (hasOldTable) {
      console.log("\n❌ ISSUE FOUND: File still contains old table structure!")
      console.log("The file needs to be completely replaced with the enhanced version.")
    } else if (hasEnhancedTable && hasGoalBadge && hasStartTimeBadge) {
      console.log("\n✅ SUCCESS: File contains enhanced version!")
      console.log("The issue might be caching or build-related.")
    } else {
      console.log("\n⚠️ PARTIAL: File has some enhanced features but may be incomplete.")
    }
  } else {
    console.log("❌ File does not exist at:", adminPagePath)
  }
} catch (error) {
  console.error("❌ Error reading file:", error.message)
}

// 2. Check if there are any other admin page files
console.log("\n🔍 Checking for other admin page files...")
const adminDir = path.join(process.cwd(), "app/admin")
try {
  if (fs.existsSync(adminDir)) {
    const adminFiles = fs.readdirSync(adminDir, { recursive: true })
    const pageFiles = adminFiles.filter((file) => file.includes("page.tsx") || file.includes("page.ts"))
    console.log("📄 Admin page files found:")
    pageFiles.forEach((file) => {
      console.log("  -", file)
    })
  }
} catch (error) {
  console.error("❌ Error reading admin directory:", error.message)
}

// 3. Check package.json for Next.js version
console.log("\n📦 Checking Next.js version...")
try {
  const packagePath = path.join(process.cwd(), "package.json")
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    const nextVersion = packageContent.dependencies?.next || packageContent.devDependencies?.next
    console.log("⚡ Next.js version:", nextVersion || "Not found")
  }
} catch (error) {
  console.error("❌ Error reading package.json:", error.message)
}

// 4. Check if there's a build directory
console.log("\n🏗️ Checking build status...")
const buildDir = path.join(process.cwd(), ".next")
if (fs.existsSync(buildDir)) {
  console.log("✅ .next build directory exists")

  // Check if there's a cached version
  const cacheDir = path.join(buildDir, "cache")
  if (fs.existsSync(cacheDir)) {
    console.log("📦 Build cache exists - this might be serving old content")
    console.log("💡 Try: rm -rf .next && npm run build")
  }
} else {
  console.log("❌ No .next build directory found")
  console.log("💡 Try: npm run build")
}

// 5. Environment check
console.log("\n🌍 Environment check...")
console.log("NODE_ENV:", process.env.NODE_ENV || "not set")
console.log("Current directory:", process.cwd())

console.log("\n🎯 RECOMMENDATIONS:")
console.log("1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)")
console.log("2. Clear browser cache")
console.log("3. Delete .next folder and rebuild: rm -rf .next && npm run build")
console.log("4. Check browser dev tools Network tab for 304 responses")
console.log("5. Try incognito/private browsing mode")

console.log("\n✅ Debug complete!")
