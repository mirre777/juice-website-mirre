"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugEnvPage() {
  const [firebaseTest, setFirebaseTest] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testFirebaseConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-firestore")
      const data = await response.json()
      setFirebaseTest(JSON.stringify(data, null, 2))
    } catch (error) {
      setFirebaseTest(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Environment Debug Page</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Client-side accessible environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || "Not set"}
              </div>
              <div>
                <strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong>{" "}
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set"}
              </div>
              <div>
                <strong>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</strong>{" "}
                {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set"}
              </div>
              <div>
                <strong>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</strong>{" "}
                {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "Set" : "Not set"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firebase Connection Test</CardTitle>
            <CardDescription>Test Firebase connection via API route</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testFirebaseConnection} disabled={loading}>
              {loading ? "Testing..." : "Test Firebase Connection"}
            </Button>
            {firebaseTest && <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">{firebaseTest}</pre>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
