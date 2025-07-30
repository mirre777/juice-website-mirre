// Check the actual PaymentElement component configuration
// This will help identify if promotionCodes option is missing

console.log("🔍 CHECKING PAYMENT ELEMENT SOURCE CODE")
console.log("=======================================")

const fs = require("fs")
const path = require("path")

const checkPaymentElementFiles = () => {
  try {
    console.log("\n1️⃣ SEARCHING FOR PAYMENT ELEMENT COMPONENTS")
    console.log("--------------------------------------------")

    // Common locations for payment components
    const searchPaths = ["components/payment", "app/payment", "components", "app"]

    const paymentFiles = []

    const searchInDirectory = (dir) => {
      try {
        if (!fs.existsSync(dir)) return

        const files = fs.readdirSync(dir, { withFileTypes: true })

        for (const file of files) {
          const fullPath = path.join(dir, file.name)

          if (file.isDirectory()) {
            searchInDirectory(fullPath)
          } else if (file.name.includes("payment") || file.name.includes("stripe")) {
            paymentFiles.push(fullPath)
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    searchPaths.forEach(searchInDirectory)

    console.log(`Found ${paymentFiles.length} payment-related files:`)
    paymentFiles.forEach((file) => console.log(`  📄 ${file}`))

    console.log("\n2️⃣ CHECKING FOR PROMOTION CODE CONFIGURATION")
    console.log("---------------------------------------------")

    let foundPromotionConfig = false

    paymentFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8")

        // Check for promotion code related configuration
        const hasPromotionCodes = content.includes("promotionCodes")
        const hasPromotionEnabled = content.includes("promotionCodes") && content.includes("enabled")
        const hasElements = content.includes("Elements") || content.includes("PaymentElement")

        if (hasElements) {
          console.log(`\n📄 ${filePath}:`)
          console.log(`  Contains Elements: ${hasElements}`)
          console.log(`  Contains promotionCodes: ${hasPromotionCodes}`)
          console.log(`  Has promotion enabled: ${hasPromotionEnabled}`)

          if (hasPromotionCodes) {
            foundPromotionConfig = true

            // Extract the relevant lines
            const lines = content.split("\n")
            lines.forEach((line, index) => {
              if (line.includes("promotionCodes")) {
                console.log(`    Line ${index + 1}: ${line.trim()}`)
              }
            })
          }
        }
      } catch (error) {
        console.log(`  ❌ Could not read ${filePath}:`, error.message)
      }
    })

    console.log("\n3️⃣ SUMMARY")
    console.log("----------")
    if (foundPromotionConfig) {
      console.log("✅ Found promotion code configuration in source")
    } else {
      console.log("❌ No promotion code configuration found in source")
      console.log("   This is likely the issue!")
    }
  } catch (error) {
    console.log("❌ Error checking payment element files:", error)
  }
}

checkPaymentElementFiles()
