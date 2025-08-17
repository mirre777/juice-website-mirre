"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugStripePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stripeConfig, setStripeConfig] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  useEffect(() => {
    async function checkStripeConfig() {
      try {
        setLoading(true)
        const response = await fetch("/api/debug-stripe")

        if (!response.ok) {
          throw new Error(`Failed to check Stripe configuration: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setStripeConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    checkStripeConfig()
  }, [])

  const testCreatePaymentIntent = async () => {
    try {
      setTestLoading(true)
      setTestResult(null)

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: "10.00",
          description: "Test payment intent",
          metadata: {
            test: "true",
            timestamp: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()

      setTestResult({
        success: response.ok,
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Stripe Configuration Debug</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Stripe Environment Variables</CardTitle>
          <CardDescription>Check if your Stripe keys are properly configured</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">STRIPE_SECRET_KEY:</div>
                <div className={stripeConfig?.stripeSecretKeySet ? "text-green-600" : "text-red-600"}>
                  {stripeConfig?.stripeSecretKeySet ? `Set (${stripeConfig.keyPreview})` : "Not set"}
                </div>

                <div className="font-medium">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</div>
                <div className={stripeConfig?.publishableKeySet ? "text-green-600" : "text-red-600"}>
                  {stripeConfig?.publishableKeySet ? "Set" : "Not set"}
                </div>

                <div className="font-medium">Environment:</div>
                <div>{stripeConfig?.environment}</div>

                <div className="font-medium">Checked at:</div>
                <div>{new Date(stripeConfig?.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Payment Intent Creation</CardTitle>
          <CardDescription>Test if your Stripe API can create a payment intent</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={testCreatePaymentIntent}
            disabled={testLoading || !stripeConfig?.stripeSecretKeySet}
            className="mb-6"
          >
            {testLoading ? "Testing..." : "Test Create Payment Intent"}
          </Button>

          {testResult && (
            <div className={`mt-4 p-4 rounded-md ${testResult.success ? "bg-green-50" : "bg-red-50"}`}>
              <h3 className={`font-bold mb-2 ${testResult.success ? "text-green-600" : "text-red-600"}`}>
                {testResult.success ? "Success" : "Error"}
              </h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
