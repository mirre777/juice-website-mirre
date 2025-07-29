#!/usr/bin/env node

console.log("🔍 Checking Environment Variables...\n")

// Required environment variables for the application
const REQUIRED_ENV_VARS = {
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: {
    description: "Firebase API Key (public)",
    example: "AIzaSyC...",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {
    description: "Firebase Auth Domain (public)",
    example: "your-project.firebaseapp.com",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: {
    description: "Firebase Project ID (public)",
    example: "your-project-id",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {
    description: "Firebase Storage Bucket (public)",
    example: "your-project.appspot.com",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: {
    description: "Firebase Messaging Sender ID (public)",
    example: "123456789",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_APP_ID: {
    description: "Firebase App ID (public)",
    example: "1:123:web:abc123",
    required: true,
  },
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: {
    description: "Firebase Analytics Measurement ID (public)",
    example: "G-XXXXXXXXXX",
    required: false,
  },

  // Firebase Admin (Server-side)
  FIREBASE_PROJECT_ID: {
    description: "Firebase Project ID (server)",
    example: "your-project-id",
    required: true,
  },
  FIREBASE_CLIENT_EMAIL: {
    description: "Firebase Service Account Email",
    example: "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
    required: true,
  },
  FIREBASE_PRIVATE_KEY: {
    description: "Firebase Service Account Private Key",
    example: "-----BEGIN PRIVATE KEY-----\n...",
    required: true,
  },
  FIREBASE_PRIVATE_KEY_ID: {
    description: "Firebase Private Key ID",
    example: "abc123def456",
    required: false,
  },
  FIREBASE_CLIENT_ID: {
    description: "Firebase Client ID",
    example: "123456789012345678901",
    required: false,
  },

  // Stripe Configuration
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    description: "Stripe Publishable Key (public)",
    example: "pk_test_...",
    required: true,
  },
  STRIPE_SECRET_KEY: {
    description: "Stripe Secret Key (server)",
    example: "sk_test_...",
    required: true,
  },
  STRIPE_WEBHOOK_SECRET: {
    description: "Stripe Webhook Secret",
    example: "whsec_...",
    required: true,
  },

  // Application Configuration
  NEXT_PUBLIC_APP_URL: {
    description: "Application Base URL",
    example: "https://your-app.vercel.app",
    required: false,
  },
  DEBUG_TOKEN: {
    description: "Debug Token for development",
    example: "debug_token_123",
    required: false,
  },
  BLOB_READ_WRITE_TOKEN: {
    description: "Vercel Blob Storage Token",
    example: "vercel_blob_rw_...",
    required: false,
  },
}

// Check each environment variable
const results = {
  present: [],
  missing: [],
  invalid: [],
  optional_missing: [],
}

console.log("📋 Environment Variable Status:\n")
console.log("=".repeat(80))

for (const [varName, config] of Object.entries(REQUIRED_ENV_VARS)) {
  const value = process.env[varName]
  const status = value ? "✅" : config.required ? "❌" : "⚠️"

  console.log(`${status} ${varName}`)
  console.log(`   Description: ${config.description}`)

  if (value) {
    // Check if value looks valid
    let isValid = true
    let validationMessage = ""

    if (varName.includes("STRIPE") && varName.includes("PUBLISHABLE")) {
      isValid = value.startsWith("pk_")
      validationMessage = isValid ? "" : " (should start with pk_)"
    } else if (varName.includes("STRIPE") && varName.includes("SECRET")) {
      isValid = value.startsWith("sk_")
      validationMessage = isValid ? "" : " (should start with sk_)"
    } else if (varName.includes("STRIPE") && varName.includes("WEBHOOK")) {
      isValid = value.startsWith("whsec_")
      validationMessage = isValid ? "" : " (should start with whsec_)"
    } else if (varName.includes("FIREBASE") && varName.includes("PRIVATE_KEY")) {
      isValid = value.includes("BEGIN PRIVATE KEY")
      validationMessage = isValid ? "" : " (should be a valid private key)"
    } else if (varName.includes("FIREBASE") && varName.includes("EMAIL")) {
      isValid = value.includes("@") && value.includes(".iam.gserviceaccount.com")
      validationMessage = isValid ? "" : " (should be a service account email)"
    }

    console.log(`   Value: ${value.substring(0, 20)}...${validationMessage}`)

    if (isValid) {
      results.present.push(varName)
    } else {
      results.invalid.push({ name: varName, issue: validationMessage })
    }
  } else {
    console.log(`   Example: ${config.example}`)

    if (config.required) {
      results.missing.push(varName)
    } else {
      results.optional_missing.push(varName)
    }
  }

  console.log("")
}

// Summary
console.log("=".repeat(80))
console.log("📊 SUMMARY:\n")

console.log(`✅ Present and Valid: ${results.present.length}`)
results.present.forEach((name) => console.log(`   - ${name}`))

if (results.missing.length > 0) {
  console.log(`\n❌ Missing (Required): ${results.missing.length}`)
  results.missing.forEach((name) => console.log(`   - ${name}`))
}

if (results.invalid.length > 0) {
  console.log(`\n⚠️  Invalid Format: ${results.invalid.length}`)
  results.invalid.forEach((item) => console.log(`   - ${item.name}${item.issue}`))
}

if (results.optional_missing.length > 0) {
  console.log(`\n⚠️  Missing (Optional): ${results.optional_missing.length}`)
  results.optional_missing.forEach((name) => console.log(`   - ${name}`))
}

// Instructions
if (results.missing.length > 0 || results.invalid.length > 0) {
  console.log("\n🔧 TO FIX:")
  console.log("1. Go to Vercel Dashboard")
  console.log("2. Select your project")
  console.log("3. Go to Settings > Environment Variables")
  console.log("4. Add the missing variables listed above")
  console.log("5. Redeploy your application")

  process.exit(1)
} else {
  console.log("\n🎉 All required environment variables are present and valid!")
  process.exit(0)
}
