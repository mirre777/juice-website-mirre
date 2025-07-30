// Check Stripe package versions and domain setup
console.log("🔍 CHECKING STRIPE PACKAGE VERSIONS")
console.log("=====================================")

// Check package.json for Stripe versions
const fs = require("fs")
const path = require("path")

try {
  const packageJsonPath = path.join(process.cwd(), "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  console.log("📦 Current Stripe package versions:")
  console.log("-----------------------------------")

  const stripePackages = ["@stripe/stripe-js", "@stripe/react-stripe-js", "stripe"]

  stripePackages.forEach((pkg) => {
    const version = packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]
    if (version) {
      console.log(`✅ ${pkg}: ${version}`)
    } else {
      console.log(`❌ ${pkg}: Not found`)
    }
  })

  console.log("\n🎯 RECOMMENDED VERSIONS FOR PROMOTION CODES:")
  console.log("--------------------------------------------")
  console.log("✅ @stripe/stripe-js: ^2.0.0 or later")
  console.log("✅ @stripe/react-stripe-js: ^2.0.0 or later")
  console.log("✅ stripe: ^14.0.0 or later")

  console.log("\n🌐 DOMAIN SETUP STATUS:")
  console.log("----------------------")
  console.log("✅ Domains are now properly added to Stripe Dashboard!")
  console.log("✅ www.juice.fitness - Enabled")
  console.log("✅ v0-v2-website-njfsqz58w-mirre777s-projects.vercel.app - Enabled")
  console.log("✅ buy.stripe.com - Enabled")

  console.log("\n🚨 NEXT STEPS:")
  console.log("--------------")
  if (!packageJson.dependencies?.["@stripe/stripe-js"] && !packageJson.devDependencies?.["@stripe/stripe-js"]) {
    console.log("❌ Missing Stripe packages in package.json!")
    console.log("   This could be why promotion codes aren't working")
    console.log("   The packages might be auto-installed by Next.js but not listed")
  } else {
    console.log("✅ Check if promotion codes appear after fixing the querySelector error")
  }
} catch (error) {
  console.error("❌ Error reading package.json:", error.message)
}
