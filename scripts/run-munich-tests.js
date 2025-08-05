console.log("🚀 Running Munich Form Tests...")

// Import and run the test
import("./test-munich-form-complete.js")
  .then(() => {
    console.log("✅ Munich form tests completed")
  })
  .catch((error) => {
    console.error("❌ Error running Munich form tests:", error)
  })
