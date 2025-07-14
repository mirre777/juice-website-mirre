"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugFirestorePage() {
  const [readResult, setReadResult] = useState<any>(null)
  const [writeResult, setWriteResult] = useState<any>(null)
  const [isReadLoading, setIsReadLoading] = useState(false)
  const [isWriteLoading, setIsWriteLoading] = useState(false)

  const testRead = async () => {
    setIsReadLoading(true)
    try {
      const response = await fetch("/api/debug-firestore?action=read")
      const result = await response.json()
      setReadResult(result)
    } catch (error) {
      setReadResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsReadLoading(false)
    }
  }

  const testWrite = async () => {
    setIsWriteLoading(true)
    try {
      const response = await fetch("/api/debug-firestore?action=write")
      const result = await response.json()
      setWriteResult(result)
    } catch (error) {
      setWriteResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsWriteLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Firestore Debug</h1>

        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={testRead}
              disabled={isReadLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isReadLoading ? "Testing..." : "Test Read"}
            </button>

            <button
              onClick={testWrite}
              disabled={isWriteLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isWriteLoading ? "Testing..." : "Test Write"}
            </button>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Read Test Results</h2>
            <div className="bg-black/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {readResult ? JSON.stringify(readResult, null, 2) : "No test run yet"}
              </pre>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Write Test Results</h2>
            <div className="bg-black/50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {writeResult ? JSON.stringify(writeResult, null, 2) : "No test run yet"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
