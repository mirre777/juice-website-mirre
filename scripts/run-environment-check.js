// Main script runner for environment checks
const { spawn } = require("child_process")
const path = require("path")

console.log("🔧 Running Complete Environment Check...\n")

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName)
    const child = spawn("node", [scriptPath], { stdio: "inherit" })

    child.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`))
      }
    })
  })
}

async function runAllChecks() {
  try {
    console.log("1️⃣ Checking Environment Variables...\n")
    await runScript("check-vercel-environment.js")

    console.log("\n" + "=".repeat(60) + "\n")

    console.log("2️⃣ Testing API Endpoints...\n")
    await runScript("test-api-endpoints.js")

    console.log("\n" + "=".repeat(60) + "\n")

    console.log("3️⃣ Testing Complete Trainer Flow...\n")
    await runScript("test-trainer-flow-complete.js")

    console.log("\n🎉 All checks completed successfully!")
  } catch (error) {
    console.error(`❌ Check failed: ${error.message}`)
    process.exit(1)
  }
}

runAllChecks()
