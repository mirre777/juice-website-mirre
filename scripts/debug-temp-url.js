// Debug script to check temp URL and Firebase connection

const debugTempUrl = async () => {
  console.log("🔍 Debugging Temp URL Structure...\n")

  // Current URLs from your message
  const currentUrl =
    "https://v0-v2-website-git-webpage-inline-editor-mirre777s-projects.vercel.app/marketplace/trainer/temp/ciQ7n9QQbrV6HfSRoFPe"
  const previousUrl =
    "https://v0-v2-website-git-webpage-inline-editor-mirre777s-projects.vercel.app/marketplace/trainer/temp/mUxRul3aSQp2OSeZMbat?token=599rfxcnabv8qeb7esxpgxdo"

  console.log("📋 URL Analysis:")
  console.log("Current URL:", currentUrl)
  console.log("Previous URL:", previousUrl)
  console.log("")

  // Extract tempIds
  const currentTempId = "ciQ7n9QQbrV6HfSRoFPe"
  const previousTempId = "mUxRul3aSQp2OSeZMbat"
  const previousToken = "599rfxcnabv8qeb7esxpgxdo"

  console.log("🔑 Extracted Information:")
  console.log("Current TempId:", currentTempId)
  console.log("Previous TempId:", previousTempId)
  console.log("Previous Token:", previousToken)
  console.log("")

  console.log("🤔 Token Analysis:")
  console.log("- Token is NOT required for basic functionality")
  console.log("- Token was likely used for additional security/validation")
  console.log("- Current implementation should work without token")
  console.log("- 404 suggests the tempId might not exist in Firebase")
  console.log("")

  console.log("🔧 Debugging Steps:")
  console.log("1. Test API endpoint directly:")
  console.log(`   GET /api/trainer/temp/${currentTempId}`)
  console.log("")
  console.log("2. Check Firebase temp_trainers collection for:")
  console.log(`   Document ID: ${currentTempId}`)
  console.log("")
  console.log("3. Verify the trainer creation process worked:")
  console.log("   - Form submission successful?")
  console.log("   - Firebase write successful?")
  console.log("   - Correct redirect URL generated?")
  console.log("")

  console.log("🧪 Test Commands:")
  console.log("# Test current tempId API endpoint")
  console.log(`curl -X GET "${currentUrl.replace("/marketplace/trainer/temp/", "/api/trainer/temp/")}"`)
  console.log("")
  console.log("# Test previous tempId API endpoint")
  console.log(`curl -X GET "${previousUrl.replace("/marketplace/trainer/temp/", "/api/trainer/temp/").split("?")[0]}"`)
  console.log("")

  console.log("💡 Likely Issues:")
  console.log("1. TempId does not exist in Firebase temp_trainers collection")
  console.log("2. Firebase configuration issue")
  console.log("3. Trainer creation failed silently")
  console.log("4. Database connection issue")
  console.log("")

  console.log("✅ Next Steps:")
  console.log("1. Run the API test to see if tempId exists")
  console.log("2. Check Firebase console for temp_trainers collection")
  console.log("3. Test trainer creation process again")
  console.log("4. Check server logs for any errors")
}

// Run the debug
debugTempUrl()

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { debugTempUrl }
}
