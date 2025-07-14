"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FirestoreDebugPage() {
  const [readResults, setReadResults] = useState<any>(null)
  const [writeResults, setWriteResults] = useState<any>(null)
  const [loading, setLoading] = useState<{ read: boolean; write: boolean }>({
    read: false,
    write: false,
  })

  const testRead = async () => {
    setLoading((prev) => ({ ...prev, read: true }))
    try {
      const response = await fetch("/api/debug-firestore")
      const data = await response.json()
      setReadResults(data)
    } catch (error) {
      setReadResults({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading((prev) => ({ ...prev, read: false }))
    }
  }

  const testWrite = async () => {
    setLoading((prev) => ({ ...prev, write: true }))
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
      setWriteResults({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading((prev) => ({ ...prev, write: false }))
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firestore Debug</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={testRead} disabled={loading.read} variant="outline">
          {loading.read ? "Testing..." : "Test Read"}
        </Button>
        <Button onClick={testWrite} disabled={loading.write} variant="outline">
          {loading.write ? "Testing..." : "Test Write"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Read Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {readResults ? JSON.stringify(readResults, null, 2) : "No results yet"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Write Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {writeResults ? JSON.stringify(writeResults, null, 2) : "No results yet"}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
