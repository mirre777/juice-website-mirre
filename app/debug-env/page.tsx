"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get client-side environment variables
    const clientEnvVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    }

    setEnvVars(clientEnvVars)
    setLoading(false)
  }, [])

  const getStatus = (value: string | undefined) => {
    if (!value) return { status: "missing", icon: XCircle, color: "destructive" }
    if (value.includes("undefined") || value.includes("your-"))
      return { status: "placeholder", icon: AlertCircle, color: "secondary" }
    return { status: "configured", icon: CheckCircle, color: "default" }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading environment variables...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Environment Variables Debug</h1>
        <p className="text-muted-foreground">Check the status of your environment variables</p>
      </div>

      <div className="grid gap-4">
        {Object.entries(envVars).map(([key, value]) => {
          const { status, icon: Icon, color } = getStatus(value)

          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{key}</CardTitle>
                  <Badge variant={color as any}>
                    <Icon className="w-3 h-3 mr-1" />
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  {value
                    ? key.toLowerCase().includes("key") || key.toLowerCase().includes("secret")
                      ? `${value.substring(0, 8)}...`
                      : value
                    : "Not set"}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debug Actions</CardTitle>
          <CardDescription>Test environment configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
            Refresh Environment Variables
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
