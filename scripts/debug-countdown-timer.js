console.log("🕐 Debug: Countdown Timer Analysis")
console.log("=".repeat(50))

// Test data - simulating the expiresAt from database
const testExpiresAt = "2025-07-17T20:12:58.510Z"

console.log("📅 Test 1: Date parsing...")
console.log("Raw expiresAt:", testExpiresAt)

try {
  const expirationDate = new Date(testExpiresAt)
  console.log("Parsed date:", expirationDate)
  console.log("Is valid date:", !isNaN(expirationDate.getTime()))
  console.log("Timestamp:", expirationDate.getTime())
} catch (error) {
  console.log("❌ Date parsing failed:", error.message)
}

console.log("\n⏰ Test 2: Time calculation...")
const now = new Date()
const expires = new Date(testExpiresAt)
const timeDiff = expires.getTime() - now.getTime()

console.log("Current time:", now.toISOString())
console.log("Expiration time:", expires.toISOString())
console.log("Time difference (ms):", timeDiff)
console.log("Time difference (hours):", Math.floor(timeDiff / (1000 * 60 * 60)))

// Format time function
function formatTimeRemaining(milliseconds) {
  if (milliseconds <= 0) return "Expired"

  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
}

console.log("\n🎯 Test 3: Format validation...")
const formatted = formatTimeRemaining(timeDiff)
console.log("Formatted:", formatted)

console.log("ISO format valid:", /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(testExpiresAt))
console.log("Expected format: YYYY-MM-DDTHH:mm:ss.sssZ")
console.log("Actual format:", testExpiresAt)

console.log("\n⏱️ Test 4: Countdown simulation...")
let remainingTime = timeDiff
for (let i = 1; i <= 5; i++) {
  console.log(`Update ${i}:`, formatTimeRemaining(remainingTime))
  remainingTime -= 1000 // Subtract 1 second
}

console.log("\n🔍 Potential Issues Analysis:")
console.log("⚠️ Hours won't change for a while (normal if >1h remaining)")

console.log("\n📋 Recommendations:")
console.log("1. Ensure useEffect has proper dependency array")
console.log("2. Check if setInterval is being cleared properly")
console.log("3. Verify component re-renders on state changes")
console.log("4. Make sure expiresAt is being fetched correctly")
console.log("5. Add error handling for invalid dates")

console.log("\n🔧 Next Steps:")
console.log("- Check TempTrainerPage component for countdown logic")
console.log("- Verify API response includes correct expiresAt format")
console.log("- Test countdown updates in real-time")
console.log("- Add debugging logs to countdown component")
