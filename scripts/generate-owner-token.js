// Simple script to generate owner tokens for testing
// Run with: node scripts/generate-owner-token.js <trainerId>

function generateOwnerToken(trainerId) {
  // This should match the logic in lib/auth-utils.ts
  return Buffer.from(`owner:${trainerId}:${Date.now()}`).toString("base64")
}

const trainerId = process.argv[2]

if (!trainerId) {
  console.log("Usage: node scripts/generate-owner-token.js <trainerId>")
  console.log("Example: node scripts/generate-owner-token.js POj2MRZ5ZRbq3CW1U0zJ")
  process.exit(1)
}

const token = generateOwnerToken(trainerId)
const testUrl = `http://localhost:3000/marketplace/trainer/${trainerId}?token=${encodeURIComponent(token)}`

console.log("=== OWNER TOKEN GENERATED ===")
console.log("Trainer ID:", trainerId)
console.log("Token:", token)
console.log("Test URL:", testUrl)
console.log("")
console.log("Use this URL to access the trainer profile as the owner.")
console.log('You can then use the "View Live" button to see the visitor view.')
