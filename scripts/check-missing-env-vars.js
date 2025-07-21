// Environment Variables Check - Shows exactly which vars are missing
console.log("🔍 CHECKING ENVIRONMENT VARIABLES")
console.log("=".repeat(70))

const requiredEnvVars = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: {
    description: "Stripe Secret Key",
    category: "Stripe",
    required: true,
    format: "sk_test_... or sk_live_...",
  },
  STRIPE_WEBHOOK_SECRET: {
    description: "Stripe Webhook Secret",
    category: "Stripe",
    required: true,
    format: "whsec_...",
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    description: "Stripe Publishable Key",
    category: "Stripe",
    required: true,
    format: "pk_test_... or pk_live_...",
  },

  // Firebase Configuration
  FIREBASE_PROJECT_ID: {
    description: "Firebase Project ID",
    category: "Firebase",
    required: true,
    format: "your-project-id",
  },
  FIREBASE_CLIENT_EMAIL: {
    description: "Firebase Client Email",
    category: "Firebase",
    required: true,
    format: "firebase-adminsdk-...@your-project.iam.gserviceaccount.com",
  },
  FIREBASE_PRIVATE_KEY: {
    description: "Firebase Private Key",
    category: "Firebase",
    required: true,
    format: "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  },
  FIREBASE_PRIVATE_KEY_ID: {
    description: "Firebase Private Key ID",
    category: "Firebase",
    required: false,
    format: "key-id-string",
  },
  FIREBASE_CLIENT_ID: {
    description: "Firebase Client ID",
    category: "Firebase",
    required: false,
    format: "client-id-number",
  },

  // Next.js Public Variables
  NEXT_PUBLIC_FIREBASE_API_KEY: {
    description: "Firebase API Key (Public)",
    category: "Firebase Public",
    required: true,
    format: "AIza...",
  },
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {
    description: "Firebase Auth Domain (Public)",
    category: "Firebase Public",
    required: true,
    format: "your-project.firebaseapp.com",
  },
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: {
    description: "Firebase Project ID (Public)",
    category: "Firebase Public",
    required: true,
    format: "your-project-id",
  },
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {
    description: "Firebase Storage Bucket (Public)",
    category: "Firebase Public",
    required: true,
    format: "your-project.appspot.com",
  },
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: {
    description: "Firebase Messaging Sender ID (Public)",
    category: "Firebase Public",
    required: true,
    format: "123456789",
  },
  NEXT_PUBLIC_FIREBASE_APP_ID: {
    description: "Firebase App ID (Public)",
    category: "Firebase Public",
    required: true,
    format: "1:123456789:web:abcdef...",
  },
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: {
    description: "Firebase Measurement ID (Public)",
    category: "Firebase Public",
    required: false,
    format: "G-XXXXXXXXXX",
  },
}

// Check each environment variable
const results = {
  present: [],
  missing: [],
  invalid: [],
  categories: {},
}

console.log("Checking environment variables...\n")

Object.entries(requiredEnvVars).forEach(([key, config]) => {
  const value = process.env[key]
  const isPresent = value && value.trim() !== ""

  // Initialize category if not exists
  if (!results.categories[config.category]) {
    results.categories[config.category] = {
      present: [],
      missing: [],
      invalid: [],
    }
  }

  if (!isPresent) {
    if (config.required) {
      results.missing.push({ key, ...config })
      results.categories[config.category].missing.push({ key, ...config })
      console.log(`❌ ${key.padEnd(40)} | MISSING (Required)`)
    } else {
      console.log(`⚠️  ${key.padEnd(40)} | MISSING (Optional)`)
    }
  } else {
    // Check format if present
    let formatValid = true
    let formatMessage = ""

    if (key.includes("STRIPE_SECRET_KEY") && !value.startsWith("sk_")) {
      formatValid = false
      formatMessage = "Should start with 'sk_'"
    } else if (key.includes("STRIPE_PUBLISHABLE_KEY") && !value.startsWith("pk_")) {
      formatValid = false
      formatMessage = "Should start with 'pk_'"
    } else if (key.includes("STRIPE_WEBHOOK_SECRET") && !value.startsWith("whsec_")) {
      formatValid = false
      formatMessage = "Should start with 'whsec_'"
    } else if (key.includes("FIREBASE_PRIVATE_KEY") && !value.includes("-----BEGIN PRIVATE KEY-----")) {
      formatValid = false
      formatMessage = "Should contain BEGIN PRIVATE KEY marker"
    } else if (
      key.includes("FIREBASE_CLIENT_EMAIL") &&
      !value.includes("@") &&
      !value.includes(".iam.gserviceaccount.com")
    ) {
      formatValid = false
      formatMessage = "Should be a service account email"
    }

    if (formatValid) {
      results.present.push({ key, ...config })
      results.categories[config.category].present.push({ key, ...config })
      console.log(`✅ ${key.padEnd(40)} | PRESENT`)
    } else {
      results.invalid.push({ key, ...config, formatMessage })
      results.categories[config.category].invalid.push({ key, ...config, formatMessage })
      console.log(`⚠️  ${key.padEnd(40)} | PRESENT (Invalid format: ${formatMessage})`)
    }
  }
})

// Summary by category
console.log("\n" + "=".repeat(70))
console.log("📊 SUMMARY BY CATEGORY")
console.log("=".repeat(70))

Object.entries(results.categories).forEach(([category, categoryResults]) => {
  const total = categoryResults.present.length + categoryResults.missing.length + categoryResults.invalid.length
  const working = categoryResults.present.length
  const status = categoryResults.missing.length === 0 && categoryResults.invalid.length === 0 ? "✅" : "❌"

  console.log(`${status} ${category.padEnd(20)} | ${working}/${total} configured`)

  if (categoryResults.missing.length > 0) {
    categoryResults.missing.forEach((item) => {
      console.log(`   ❌ Missing: ${item.key}`)
    })
  }

  if (categoryResults.invalid.length > 0) {
    categoryResults.invalid.forEach((item) => {
      console.log(`   ⚠️  Invalid: ${item.key} (${item.formatMessage})`)
    })
  }
})

// Overall summary
console.log("\n" + "=".repeat(70))
console.log("🎯 OVERALL SUMMARY")
console.log("=".repeat(70))

const totalRequired = Object.values(requiredEnvVars).filter((config) => config.required).length
const presentRequired = results.present.filter((item) => item.required).length
const missingRequired = results.missing.length
const invalidCount = results.invalid.length

console.log(`Total Required Variables: ${totalRequired}`)
console.log(`✅ Present & Valid: ${presentRequired}`)
console.log(`❌ Missing: ${missingRequired}`)
console.log(`⚠️  Invalid Format: ${invalidCount}`)

if (missingRequired === 0 && invalidCount === 0) {
  console.log("\n🎉 ALL REQUIRED ENVIRONMENT VARIABLES ARE PROPERLY CONFIGURED!")
  process.exit(0)
} else {
  console.log("\n❌ CONFIGURATION INCOMPLETE")

  if (missingRequired > 0) {
    console.log("\n🔧 MISSING VARIABLES TO ADD:")
    results.missing.forEach((item) => {
      console.log(`   ${item.key}`)
      console.log(`   Description: ${item.description}`)
      console.log(`   Format: ${item.format}`)
      console.log("")
    })
  }

  if (invalidCount > 0) {
    console.log("🔧 VARIABLES WITH INVALID FORMAT:")
    results.invalid.forEach((item) => {
      console.log(`   ${item.key}: ${item.formatMessage}`)
    })
  }

  console.log("\n📝 TO FIX:")
  console.log("1. Go to Vercel Dashboard")
  console.log("2. Navigate to Project > Settings > Environment Variables")
  console.log("3. Add/fix the variables listed above")
  console.log("4. Redeploy your application")

  process.exit(1)
}
