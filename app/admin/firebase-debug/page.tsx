"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Database, Key, Settings } from "lucide-react"

interface FirebaseDebugInfo {
  projectId?: string
  authDomain?: string
  hasApp: boolean
  hasDb: boolean
  envVars: Record<string, boolean>
}

export default function FirebaseDebugPage() {
  const [debugInfo, setDebugInfo] = useState<FirebaseDebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/debug-firebase-temp")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Firebase debug fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "default" : "destructive"}>
        {condition ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
        {condition ? trueText : falseText}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Firebase debug information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Error Loading Debug Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDebugInfo} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Firebase Debug Dashboard</h1>
        <p className="text-muted-foreground">Monitor Firebase configuration and connectivity</p>
      </div>

      {debugInfo && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Firebase App Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Firebase App Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">App Initialized</span>
                {getStatusBadge(debugInfo.hasApp, "Connected", "Not Connected")}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Project ID</span>
                <Badge variant="outline">{debugInfo.projectId || "Not Set"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Auth Domain</span>
                <Badge variant="outline">{debugInfo.authDomain || "Not Set"}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Firestore Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Firestore Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Connected</span>
                {getStatusBadge(debugInfo.hasDb, "Connected", "Not Connected")}
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Environment Variables
              </CardTitle>
              <CardDescription>Status of required Firebase environment variables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(debugInfo.envVars).map(([key, isSet]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-mono">{key}</span>
                    {getStatusBadge(isSet, "Set", "Missing")}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Debug Actions</CardTitle>
          <CardDescription>Test and refresh Firebase configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={fetchDebugInfo} variant="outline" className="w-full bg-transparent">
            Refresh Debug Info
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
