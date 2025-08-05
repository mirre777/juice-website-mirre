console.log("🔥 Firebase Connection Diagnostic Script")
console.log("=".repeat(50))

// Test 1: Check environment variables
console.log("\n📋 TEST 1: Environment Variables Check")
console.log("-".repeat(30))

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
]

const missingVars = []
const presentVars = []

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    presentVars.push(varName)
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
  } else {
    missingVars.push(varName)
    console.log(`❌ ${varName}: MISSING`)
  }
})

console.log(`\n📊 Summary: ${presentVars.length}/${requiredEnvVars.length} variables present`)

// Test 2: Check Firebase config construction
console.log("\n🔧 TEST 2: Firebase Config Construction")
console.log("-".repeat(30))

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
}

console.log("Firebase config object:")
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 15)}...`)
  } else {
    console.log(`❌ ${key}: MISSING`)
  }
})

// Test 3: Check hasRealFirebaseConfig logic
console.log("\n🔍 TEST 3: hasRealFirebaseConfig Logic")
console.log("-".repeat(30))

const checks = [
  { name: "apiKey exists", result: !!firebaseConfig.apiKey },
  { name: "authDomain exists", result: !!firebaseConfig.authDomain },
  { name: "projectId exists", result: !!firebaseConfig.projectId },
  { name: "storageBucket exists", result: !!firebaseConfig.storageBucket },
  { name: "messagingSenderId exists", result: !!firebaseConfig.messagingSenderId },
  { name: "appId exists", result: !!firebaseConfig.appId },
  { name: "projectId not demo", result: firebaseConfig.projectId !== "demo-project" },
  { name: "apiKey not demo", result: firebaseConfig.apiKey !== "demo-key" },
]

let allChecksPassed = true
checks.forEach((check) => {
  if (check.result) {
    console.log(`✅ ${check.name}`)
  } else {
    console.log(`❌ ${check.name}`)
    allChecksPassed = false
  }
})

const hasRealFirebaseConfig = allChecksPassed
console.log(`\n🎯 hasRealFirebaseConfig: ${hasRealFirebaseConfig}`)

// Test 4: Test Firebase initialization (if config is valid)
console.log("\n🚀 TEST 4: Firebase Initialization Test")
console.log("-".repeat(30))

if (hasRealFirebaseConfig) {
  try {
    // Import Firebase modules
    const { initializeApp, getApps } = require("firebase/app")
    const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore")

    console.log("📦 Firebase modules imported successfully")

    // Initialize Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    console.log("✅ Firebase app initialized")

    // Initialize Firestore
    const db = getFirestore(app)
    console.log("✅ Firestore initialized")

    console.log("🎉 Firebase initialization successful!")
  } catch (error) {
    console.log("❌ Firebase initialization failed:")
    console.log("Error:", error.message)
    console.log("Stack:", error.stack)
  }
} else {
  console.log("⏭️ Skipping Firebase initialization (config invalid)")
}

// Test 5: Test Firestore connection (if initialized)
console.log("\n📊 TEST 5: Firestore Connection Test")
console.log("-".repeat(30))

if (hasRealFirebaseConfig) {
  try {
    const { initializeApp, getApps } = require("firebase/app")
    const { getFirestore, collection, getDocs, query, limit } = require("firebase/firestore")

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const db = getFirestore(app)

    console.log("🔍 Testing connection to 'potential_users' collection...")

    // Test collection access
    const usersRef = collection(db, "potential_users")
    console.log("✅ Collection reference created")

    // Test query with limit to avoid large data transfer
    const testQuery = query(usersRef, limit(1))
    console.log("✅ Query created")

    console.log("⏳ Attempting to fetch data...")

    // This will actually try to connect to Firebase
    getDocs(testQuery)
      .then((querySnapshot) => {
        console.log("✅ Successfully connected to Firestore!")
        console.log(`📊 Collection exists with ${querySnapshot.size} document(s) in test query`)

        if (querySnapshot.size > 0) {
          const firstDoc = querySnapshot.docs[0]
          console.log("📄 First document ID:", firstDoc.id)
          console.log("📄 First document fields:", Object.keys(firstDoc.data()))
        }
      })
      .catch((error) => {
        console.log("❌ Firestore connection failed:")
        console.log("Error code:", error.code)
        console.log("Error message:", error.message)

        if (error.code === "permission-denied") {
          console.log("🔒 This is likely a Firebase Security Rules issue")
        } else if (error.code === "not-found") {
          console.log("📂 The 'potential_users' collection might not exist")
        }
      })
  } catch (error) {
    console.log("❌ Firestore test setup failed:")
    console.log("Error:", error.message)
  }
} else {
  console.log("⏭️ Skipping Firestore connection test (config invalid)")
}

// Test 6: Environment detection
console.log("\n🌍 TEST 6: Environment Detection")
console.log("-".repeat(30))

console.log("NODE_ENV:", process.env.NODE_ENV || "not set")
console.log("VERCEL:", process.env.VERCEL || "not set")
console.log("VERCEL_ENV:", process.env.VERCEL_ENV || "not set")
console.log("Current working directory:", process.cwd())

// Final recommendations
console.log("\n💡 RECOMMENDATIONS")
console.log("=".repeat(50))

if (missingVars.length > 0) {
  console.log("❌ Missing environment variables:")
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`)
  })
  console.log("\n🔧 Action: Add missing environment variables to your deployment")
}

if (!hasRealFirebaseConfig) {
  console.log("❌ Firebase configuration is invalid")
  console.log("🔧 Action: Check that all Firebase config values are set and not demo values")
}

if (hasRealFirebaseConfig) {
  console.log("✅ Firebase configuration looks valid")
  console.log("🔧 Next: Check Firebase Security Rules and collection existence")
}

console.log("\n🏁 Diagnostic complete!")
