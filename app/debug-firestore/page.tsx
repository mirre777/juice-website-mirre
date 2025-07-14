"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FirestoreDebugPage() {
  const [readResult, setReadResult] = useState<any>(null)
  const [writeResult, setWriteResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRead = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore")
      const result = await response.json()
      setReadResult(result)
    } catch (error) {
      setReadResult({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  const testWrite = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore", { method: "POST" })
      const result = await response.json()
      setWriteResult(result)
    } catch (error) {
      setWriteResult({ error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Firestore Debug</h1>

      <div className="flex gap-4 mb-8">
        <Button onClick={testRead} disabled={loading}>
          Test Read
        </Button>
        <Button onClick={testWrite} disabled={loading}>
          Test Write
        </Button>
      </div>

      {readResult && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Read Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(readResult, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {writeResult && (
        <Card>
          <CardHeader>
            <CardTitle>Write Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(writeResult, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
