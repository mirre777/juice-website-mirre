"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugFirestore() {
  const [readResults, setReadResults] = useState<any>(null)
  const [writeResults, setWriteResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRead = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore")
      const data = await response.json()
      setReadResults(data)
    } catch (error) {
      setReadResults({ error: error instanceof Error ? error.message : "Unknown error" })
    }
    setLoading(false)
  }

  const testWrite = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setWriteResults(data)
    } catch (error) {
      setWriteResults({ error: error instanceof Error ? error.message : "Unknown error" })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firestore Debug</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={testRead} disabled={loading}>
          Test Read
        </Button>
        <Button onClick={testWrite} disabled={loading}>
          Test Write
        </Button>
      </div>

      {readResults && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Read Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(readResults, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {writeResults && (
        <Card>
          <CardHeader>
            <CardTitle>Write Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(writeResults, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
