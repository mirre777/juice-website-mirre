"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugEnvPage() {
  const [envStatus] = useState<Record<string, string>>({
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Not set",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
      ? "✅ Set"
      : "❌ Not set",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Set" : "❌ Not set",
  })

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
              {Object.entries(envStatus)
                .map(([key, value]) => `${key}: ${value}\n`)
                .join("")}
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Firebase Connection Test</h3>
            <div className="mt-4 p-3 rounded bg-zinc-700/20 text-zinc-300">
              Firebase connection test disabled to prevent build errors. Use API routes for server-side Firebase
              operations.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
