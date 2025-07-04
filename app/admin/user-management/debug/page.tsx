"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function FirebaseDebugPage() {
  const [clientEnvVars, setClientEnvVars] = useState({})

  useEffect(() => {
    // Check client-side environment variables
    const clientVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
        ? "Set"
        : "Not set",
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set",
    }
    setClientEnvVars(clientVars)
  }, [])

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
          <div className="bg-zinc-800 rounded-lg overflow-hidden p-4">
            <h3 className="text-xl font-semibold mb-4">Client-Side Environment Variables</h3>
            <pre className="bg-black/50 p-3 rounded text-sm font-mono overflow-x-auto">
              {JSON.stringify(clientEnvVars, null, 2)}
            </pre>
          </div>

          <div className="bg-zinc-800 rounded-lg overflow-hidden p-4 mt-6">
            <h3 className="text-xl font-semibold mb-4">How to Fix</h3>
            <div className="space-y-4 text-zinc-400">
              <p>
                Based on the error in your screenshots, your Firebase configuration is missing the project ID in client
                components. Here's how to fix it:
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
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
