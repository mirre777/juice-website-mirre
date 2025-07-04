"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FirebaseDebugPage() {
  const [clientEnvVars, setClientEnvVars] = useState<Record<string, string>>({})
  const [testConnection, setTestConnection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check client-side environment variables
    const clientVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "Not set",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        ? "Set"
        : "Not set",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set",
    }
    setClientEnvVars(clientVars)
  }, [])

  const testFirebaseConnection = async () => {
    setIsLoading(true)
    setTestConnection("Testing connection to Firebase...")

    try {
      // Dynamically import Firebase to test if it initializes correctly
      const { getFirestore, collection, getDocs } = await import("firebase/firestore")
      const { initializeApp } = await import("firebase/app")

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      setTestConnection("Initializing Firebase app...")
      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)

      setTestConnection("Attempting to query potential_users collection...")
      const querySnapshot = await getDocs(collection(db, "potential_users"))

      setTestConnection(`Connection successful! Found ${querySnapshot.size} documents in potential_users collection.`)
    } catch (error) {
      setTestConnection(`Error connecting to Firebase: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/user-management" className="inline-flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Firebase Debug Page</h1>
          <p className="text-zinc-400 max-w-3xl mb-8">This page helps diagnose Firebase environment variable issues.</p>
        </div>

        <div className="w-full">
          <div className="bg-zinc-800 rounded-lg overflow-hidden p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">Client-Side Environment Variables</h3>
            <pre className="bg-black/50 p-3 rounded text-sm font-mono overflow-x-auto">
              {JSON.stringify(clientEnvVars, null, 2)}
            </pre>

            <div className="mt-4">
              <Button
                onClick={testFirebaseConnection}
                disabled={isLoading}
                className="bg-juice text-black hover:bg-juice/90"
              >
                {isLoading ? "Testing..." : "Test Firebase Connection"}
              </Button>

              {testConnection && (
                <div
                  className={`mt-4 p-3 rounded ${testConnection.includes("successful") ? "bg-green-900/20 text-green-400" : "bg-yellow-900/20 text-yellow-300"}`}
                >
                  {testConnection}
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg overflow-hidden p-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">How to Fix</h3>
            <div className="space-y-4 text-zinc-400">
              <p>
                If your Firebase configuration is missing environment variables in client components, here's how to fix
                it:
              </p>

              <div className="bg-black/50 p-3 rounded">
                <h4 className="font-medium text-white mb-2">Add NEXT_PUBLIC_ environment variables</h4>
                <p className="mb-2">You need to add the following environment variables to your Vercel project:</p>
                <pre className="text-sm">
                  NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
                  <br />
                  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
                  <br />
                  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
                  <br />
                  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
                  <br />
                  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
                  <br />
                  NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
                </pre>
              </div>

              <p>After adding these environment variables, redeploy your application.</p>

              <div className="bg-black/50 p-3 rounded">
                <h4 className="font-medium text-white mb-2">Important Note About Next.js Environment Variables</h4>
                <p>
                  In Next.js, only variables prefixed with <code>NEXT_PUBLIC_</code> are available in client-side code.
                  Variables without this prefix are only available in server components and server actions.
                </p>
                <p className="mt-2">Your Firebase configuration needs both sets of variables:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <code>FIREBASE_*</code> - For server components and server actions
                  </li>
                  <li>
                    <code>NEXT_PUBLIC_FIREBASE_*</code> - For client components
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
