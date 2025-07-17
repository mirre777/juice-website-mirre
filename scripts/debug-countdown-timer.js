// Debug script to analyze countdown timer functionality
console.log("🔍 Debugging Countdown Timer Functionality")
console.log("=".repeat(50))

// Test 1: Check date parsing and formatting
console.log("📅 Test 1: Date parsing and calculation...")

const testExpiresAt = "2025-07-17T20:12:58.510Z"
const currentTime = new Date()
const expirationTime = new Date(testExpiresAt)

console.log("Current time:", currentTime.toISOString())
console.log("Expiration time:", expirationTime.toISOString())
console.log("Time difference (ms):", expirationTime.getTime() - currentTime.getTime())

// Test 2: Calculate time remaining
const timeRemaining = expirationTime.getTime() - currentTime.getTime()
const isExpired = timeRemaining <= 0

console.log("Is expired:", isExpired)

if (!isExpired) {
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  console.log("Time remaining:")
  console.log(`  Hours: ${hours}`)
  console.log(`  Minutes: ${minutes}`)
  console.log(`  Seconds: ${seconds}`)
  console.log(`  Formatted: ${hours}h ${minutes}m ${seconds}s`)
}

// Test 3: Check if the format matches what we expect
console.log("\n🔧 Test 3: Format validation...")
console.log("ISO format valid:", !isNaN(expirationTime.getTime()))
console.log("Expected format: YYYY-MM-DDTHH:mm:ss.sssZ")
console.log("Actual format:", testExpiresAt)

// Test 4: Simulate countdown update
console.log("\n⏱️ Test 4: Countdown simulation...")
let simulatedTime = currentTime.getTime()
const endTime = expirationTime.getTime()

for (let i = 0; i < 5; i++) {
  const remaining = endTime - simulatedTime
  if (remaining <= 0) {
    console.log(`Update ${i + 1}: EXPIRED`)
    break
  }

  const h = Math.floor(remaining / (1000 * 60 * 60))
  const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((remaining % (1000 * 60)) / 1000)

  console.log(`Update ${i + 1}: ${h}h ${m}m ${s}s`)
  simulatedTime += 1000 // Add 1 second
}

// Test 5: Check potential issues
console.log("\n🚨 Potential Issues Analysis:")

const issues = []

if (isNaN(expirationTime.getTime())) {
  issues.push("❌ Invalid date format")
}

if (timeRemaining <= 0) {
  issues.push("❌ Timer already expired")
}

if (timeRemaining > 24 * 60 * 60 * 1000) {
  issues.push("⚠️ Timer shows more than 24 hours (might be static)")
}

// Check if the timer would update properly
const nextSecond = new Date(currentTime.getTime() + 1000)
const nextRemaining = expirationTime.getTime() - nextSecond.getTime()
const currentHours = Math.floor(timeRemaining / (1000 * 60 * 60))
const nextHours = Math.floor(nextRemaining / (1000 * 60 * 60))

if (currentHours === nextHours && timeRemaining > 1000) {
  issues.push("⚠️ Hours won't change for a while (normal if >1h remaining)")
}

if (issues.length === 0) {
  console.log("✅ No obvious issues detected")
} else {
  issues.forEach((issue) => console.log(issue))
}

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
