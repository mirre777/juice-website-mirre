console.log("🚀 Running Munich form debug script...")

// Import and run the debug script
import("./debug-munich-form-submission.js")
  .then(() => {
    console.log("✅ Debug script completed")
  })
  .catch((error) => {
    console.error("❌ Debug script failed:", error)
  })
