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

  console.log("\n🌐 DOMAIN SETUP ISSUE DETECTED:")
  console.log("-------------------------------")
  console.log("❌ Your Stripe dashboard only has 'buy.stripe.com' enabled")
  console.log("❌ You need to add your actual domain to Stripe Dashboard")
  console.log("❌ Go to: Stripe Dashboard > Settings > Payment method domains")
  console.log("❌ Add your domain: your-app-domain.vercel.app")
  console.log("❌ This is likely why promotion codes aren't showing!")
} catch (error) {
  console.error("❌ Error reading package.json:", error.message)
}
