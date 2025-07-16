"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugEnvPage() {
  const [envStatus, setEnvStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check environment variables (safely without exposing values)
    const status: Record<string, string> = {
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Not set",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Not set",
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Not set",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Not set",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        ? "✅ Set"
        : "❌ Not set",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Not set",
    }

    setEnvStatus(status)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Environment Variables Debug</h1>
          <p className="text-zinc-400 max-w-3xl mb-8">
            This page helps verify if your Firebase environment variables are properly set.
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Environment Variables Status</h2>
          <div className="bg-black/50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap">
              {Object.entries(envStatus).map(([key, value]) => `${key}: ${value}\n`)}
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Firebase Connection Test</h3>
            <FirebaseTest />
          </div>
        </div>
      </div>
    </main>
  )
}

function FirebaseTest() {
  const [testResult, setTestResult] = useState<string>("Not tested yet")
  const [isLoading, setIsLoading] = useState(false)

  const testFirebase = async () => {
    setIsLoading(true)
    setTestResult("Testing Firebase connection...")

    try {
      // Test Firebase connection via API route instead of direct import
      const response = await fetch("/api/debug-firebase-temp")
      const result = await response.json()

      if (response.ok) {
        setTestResult("✅ Firebase connection successful! " + result.message)
      } else {
        setTestResult("❌ Firebase test failed: " + result.error)
      }
    } catch (error) {
      setTestResult(`❌ Firebase test failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={testFirebase}
        disabled={isLoading}
        className="px-4 py-2 bg-juice text-black rounded-md hover:bg-juice/90 disabled:opacity-50"
      >
        {isLoading ? "Testing..." : "Test Firebase Connection"}
      </button>

      <div
        className={`mt-4 p-3 rounded ${
          testResult.includes("successful")
            ? "bg-green-900/20 text-green-400"
            : testResult.includes("failed")
              ? "bg-red-900/20 text-red-400"
              : "bg-zinc-700/20 text-zinc-300"
        }`}
      >
        {testResult}
      </div>
    </div>
  )
}
