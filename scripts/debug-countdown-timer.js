console.log("🔍 Testing Countdown Timer Functionality")
console.log("=".repeat(50))

// Test 1: Date parsing and calculation
console.log("\n⏰ Test 1: Date parsing and calculation...")

const expiresAtString = "2025-07-17T20:12:58.510Z"
const expiresAt = new Date(expiresAtString)
const now = new Date()

console.log("Current time:", now.toISOString())
console.log("Expires at:", expiresAt.toISOString())
console.log("Time difference (ms):", expiresAt.getTime() - now.getTime())

// Test 2: Countdown formatting
console.log("\n📊 Test 2: Countdown formatting...")

function formatCountdown(milliseconds) {
  if (milliseconds <= 0) return "Expired"

  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h ${minutes}m ${seconds}s`
}

const timeRemaining = expiresAt.getTime() - now.getTime()
const formatted = formatCountdown(timeRemaining)
console.log("Formatted:", formatted)

// Test 3: Format validation
console.log("\n🔍 Test 3: Format validation...")
console.log("ISO format valid:", !isNaN(expiresAt.getTime()))
console.log("Expected format: YYYY-MM-DDTHH:mm:ss.sssZ")
console.log("Actual format:", expiresAtString)

// Test 4: Countdown simulation
console.log("\n⏱️ Test 4: Countdown simulation...")
let simulatedTime = timeRemaining
for (let i = 1; i <= 5; i++) {
  console.log(`Update ${i}:`, formatCountdown(simulatedTime))
  simulatedTime -= 1000 // Subtract 1 second
}

// Analysis
console.log("\n🚨 Potential Issues Analysis:")
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
