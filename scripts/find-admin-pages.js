const fs = require("fs")
const path = require("path")

console.log("🔍 SEARCHING FOR ALL ADMIN USER MANAGEMENT FILES...\n")

function searchFiles(dir, searchTerms, results = []) {
  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory() && !file.startsWith(".") && file !== "node_modules") {
        searchFiles(filePath, searchTerms, results)
      } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js")) {
        try {
          const content = fs.readFileSync(filePath, "utf8")

          // Check if this file contains admin user management code
          const hasUserManagement = searchTerms.some((term) => content.toLowerCase().includes(term.toLowerCase()))

          if (hasUserManagement) {
            results.push({
              file: filePath,
              content: content,
              size: stat.size,
              modified: stat.mtime,
            })
          }
        } catch (err) {
          // Skip files we can't read
        }
      }
    }
  } catch (err) {
    console.log(`❌ Cannot read directory: ${dir}`)
  }

  return results
}

// Search terms that would be in admin user management files
const searchTerms = [
  "User Management",
  "Waitlist Users",
  "potential_users",
  "admin/users",
  "UserManagementPage",
  "fetchUsers",
  "Refresh List",
]

console.log("🎯 Searching for files containing:", searchTerms.join(", "))
console.log("📁 Starting from:", process.cwd())
console.log("")

const results = searchFiles(".", searchTerms)

console.log(`📊 FOUND ${results.length} FILES:\n`)

results.forEach((result, index) => {
  console.log(`📄 FILE ${index + 1}: ${result.file}`)
  console.log(`   📏 Size: ${result.size} bytes`)
  console.log(`   📅 Modified: ${result.modified.toISOString()}`)

  // Check what type of admin page this is
  const content = result.content

  if (content.includes("Enhanced Users Table")) {
    console.log("   ✅ ENHANCED VERSION (with Munich fields)")
  } else if (content.includes("User Management") && content.includes("Email")) {
    console.log("   ⚠️  BASIC VERSION (old table)")
  }

  if (content.includes("TableHead")) {
    const headers = []
    const headerMatches = content.match(/<TableHead[^>]*>(.*?)<\/TableHead>/g)
    if (headerMatches) {
      headerMatches.forEach((match) => {
        const headerText = match.replace(/<[^>]*>/g, "").trim()
        if (headerText && !headerText.includes("className")) {
          headers.push(headerText)
        }
      })
      console.log("   📋 Table Headers:", headers.join(", "))
    }
  }

  // Show first few lines to identify the file
  const lines = content.split("\n").slice(0, 10)
  console.log("   📝 First few lines:")
  lines.forEach((line, i) => {
    if (line.trim()) {
      console.log(`      ${i + 1}: ${line.trim().substring(0, 80)}${line.length > 80 ? "..." : ""}`)
    }
  })

  console.log("")
})

// Also check for any other admin-related files
console.log("🔍 CHECKING FOR OTHER ADMIN FILES...\n")

function findAdminFiles(dir) {
  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory() && file === "admin") {
        console.log(`📁 Found admin directory: ${filePath}`)

        // List all files in admin directory
        function listAdminFiles(adminDir, indent = "  ") {
          try {
            const adminFiles = fs.readdirSync(adminDir)
            adminFiles.forEach((adminFile) => {
              const adminFilePath = path.join(adminDir, adminFile)
              const adminStat = fs.statSync(adminFilePath)

              if (adminStat.isDirectory()) {
                console.log(`${indent}📁 ${adminFile}/`)
                listAdminFiles(adminFilePath, indent + "  ")
              } else {
                console.log(`${indent}📄 ${adminFile} (${adminStat.size} bytes)`)
              }
            })
          } catch (err) {
            console.log(`${indent}❌ Cannot read admin directory`)
          }
        }

        listAdminFiles(filePath)
      } else if (stat.isDirectory() && !file.startsWith(".") && file !== "node_modules") {
        findAdminFiles(filePath)
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
}

findAdminFiles(".")

console.log("\n🎯 SUMMARY:")
console.log('- Look for files marked as "BASIC VERSION" - these need to be updated')
console.log('- Files marked as "ENHANCED VERSION" should have the Munich fields')
console.log("- Check if there are multiple admin page files causing conflicts")
