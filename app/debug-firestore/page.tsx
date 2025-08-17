"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, AlertTriangle } from "lucide-react"

interface FirestoreTestResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

export default function DebugFirestorePage() {
  const [testResults, setTestResults] = useState<FirestoreTestResult[]>([])
  const [loading, setLoading] = useState(false)

  const runFirestoreTests = async () => {
    setLoading(true)
    setTestResults([])

    try {
      const response = await fetch("/api/debug-firestore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (response.ok) {
        setTestResults(result.tests || [])
      } else {
        setTestResults([
          {
            success: false,
            message: "Failed to run Firestore tests",
            error: result.error || "Unknown error",
          },
        ])
      }
    } catch (error) {
      setTestResults([
        {
          success: false,
          message: "Network error while testing Firestore",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    return <Badge variant={success ? "default" : "destructive"}>{success ? "Pass" : "Fail"}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <Database className="w-8 h-8 mr-3" />
          Firestore Debug Console
        </h1>
        <p className="text-muted-foreground">Test Firestore connectivity and operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firestore Connection Tests</CardTitle>
          <CardDescription>Run comprehensive tests to verify Firestore setup and connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runFirestoreTests} disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Tests...
              </>
            ) : (
              "Run Firestore Tests"
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {testResults.map((result, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${result.success ? "border-l-green-500" : "border-l-red-500"}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(result.success)}
                        <div className="space-y-1">
                          <p className="font-medium">{result.message}</p>
                          {result.error && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              {result.error}
                            </p>
                          )}
                          {result.data && (
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(result.success)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• This tool tests basic Firestore operations including read, write, and delete</p>
            <p>• Tests are run against a temporary collection to avoid affecting production data</p>
            <p>• All test documents are automatically cleaned up after testing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
