"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugFirestorePage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [writeTest, setWriteTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRead = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  const testWrite = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore", { method: "POST" })
      const data = await response.json()
      setWriteTest(data)
    } catch (error) {
      setWriteTest({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Firestore Debug</h1>

      <div className="flex gap-4">
        <Button onClick={testRead} disabled={loading}>
          Test Read
        </Button>
        <Button onClick={testWrite} disabled={loading}>
          Test Write
        </Button>
      </div>

      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Read Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {writeTest && (
        <Card>
          <CardHeader>
            <CardTitle>Write Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(writeTest, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
