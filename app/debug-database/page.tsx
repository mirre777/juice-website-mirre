"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function DatabaseDebugPage() {
  const [trainerId, setTrainerId] = useState("POj2MRZ5ZRbq3CW1U0zJ")
  const [testTitle, setTestTitle] = useState("")
  const [testBio, setTestBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addResult = (result: any) => {
    setResults((prev) => [{ timestamp: new Date().toISOString(), ...result }, ...prev])
  }

  const testRead = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      const data = await response.json()

      addResult({
        operation: "READ",
        success: response.ok,
        status: response.status,
        data: data,
        heroTitle: data.content?.hero?.title,
        aboutBio: data.content?.about?.bio,
      })
    } catch (error) {
      addResult({
        operation: "READ",
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const testWrite = async () => {
    if (!testTitle && !testBio) {
      alert("Please enter a test title or bio")
      return
    }

    setLoading(true)
    try {
      // First read current data
      const readResponse = await fetch(`/api/trainer/content/${trainerId}`)
      const currentData = await readResponse.json()

      if (!readResponse.ok) {
        throw new Error("Failed to read current data")
      }

      // Update with test data
      const updatedContent = {
        ...currentData.content,
        hero: {
          ...currentData.content?.hero,
          title: testTitle || currentData.content?.hero?.title,
        },
        about: {
          ...currentData.content?.about,
          bio: testBio || currentData.content?.about?.bio,
        },
      }

      const writeResponse = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: updatedContent }),
      })

      const writeData = await writeResponse.json()

      addResult({
        operation: "WRITE",
        success: writeResponse.ok,
        status: writeResponse.status,
        data: writeData,
        testTitle,
        testBio,
      })

      // Clear test fields on success
      if (writeResponse.ok) {
        setTestTitle("")
        setTestBio("")
      }
    } catch (error) {
      addResult({
        operation: "WRITE",
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const testReadAfterWrite = async () => {
    setLoading(true)
    try {
      // Small delay to ensure write is complete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await fetch(`/api/trainer/content/${trainerId}?t=${Date.now()}`) // Cache bust
      const data = await response.json()

      addResult({
        operation: "READ_AFTER_WRITE",
        success: response.ok,
        status: response.status,
        data: data,
        heroTitle: data.content?.hero?.title,
        aboutBio: data.content?.about?.bio,
      })
    } catch (error) {
      addResult({
        operation: "READ_AFTER_WRITE",
        success: false,
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Trainer ID</Label>
              <Input value={trainerId} onChange={(e) => setTrainerId(e.target.value)} placeholder="Enter trainer ID" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Title</Label>
                <Input
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Enter test title"
                />
              </div>
              <div>
                <Label>Test Bio</Label>
                <Textarea
                  value={testBio}
                  onChange={(e) => setTestBio(e.target.value)}
                  placeholder="Enter test bio"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={testRead} disabled={loading}>
                Test Read
              </Button>
              <Button onClick={testWrite} disabled={loading}>
                Test Write
              </Button>
              <Button onClick={testReadAfterWrite} disabled={loading}>
                Read After Write
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">No test results yet</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={result.success ? "default" : "destructive"}>{result.operation}</Badge>
                        <span className="text-sm text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <Badge variant="outline">{result.success ? "SUCCESS" : "FAILED"}</Badge>
                    </div>

                    {result.heroTitle && (
                      <div>
                        <strong>Hero Title:</strong> {result.heroTitle}
                      </div>
                    )}

                    {result.aboutBio && (
                      <div>
                        <strong>About Bio:</strong> {result.aboutBio.substring(0, 100)}...
                      </div>
                    )}

                    {result.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}

                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500">Raw Data</summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
