"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, CheckCircle, Timer, Zap } from "lucide-react"
import { StripePayment } from "@/components/payment/stripe-payment"

interface TempTrainerData {
  id: string
  name: string
  fullName: string
  email: string
  location: string
  specialization: string
  experience: string
  expiresAt: string
}

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [activating, setActivating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tempId = searchParams.get("tempId")
  const token = searchParams.get("token")

  useEffect(() => {
    if (tempId && token) {
      fetchTrainerData()
    } else {
      setError("Missing payment information. Please try again.")
      setLoading(false)
    }
  }, [tempId, token])

  const fetchTrainerData = async () => {
    try {
      if (!tempId || !token) {
        throw new Error("Missing required parameters")
      }

      console.log("Fetching trainer data for:", { tempId, hasToken: !!token })

      const response = await fetch(`/api/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`Failed to fetch trainer data: ${response.status}`)
      }

      const data = await response.json()
      console.log("Trainer data received:", data)

      if (data.success && data.trainer) {
        setTrainer(data.trainer)
      } else {
        throw new Error(data.error || "Invalid trainer data")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load trainer information"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentComplete = async () => {
    setPaymentComplete(true)
    setActivating(true)

    try {
      // Get payment intent ID from URL or local storage
      const urlParams = new URLSearchParams(window.location.search)
      const paymentIntentId = urlParams.get("payment_intent") || localStorage.getItem("juice_payment_reference")

      if (!paymentIntentId) {
        throw new Error("Payment intent ID not found")
      }

      console.log("Activating trainer with:", { tempId, paymentIntentId })

      // Call activation API
      const response = await fetch("/api/trainer/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempId,
          paymentIntentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Activation failed")
      }

      const data = await response.json()
      console.log("Activation response:", data)

      if (data.success && data.finalId) {
        toast({
          title: "Success!",
          description: "Your trainer website has been activated successfully!",
        })

        // Redirect to the live trainer page
        console.log("Redirecting to:", `/marketplace/trainer/${data.finalId}`)
        router.push(`/marketplace/trainer/${data.finalId}`)
      } else {
        throw new Error(data.error || "Activation failed")
      }
    } catch (error) {
      console.error("Activation error:", error)
      toast({
        title: "Activation Error",
        description: error instanceof Error ? error.message : "Failed to activate trainer profile",
        variant: "destructive",
      })
      setActivating(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          </div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-4">{error || "Unable to load trainer information"}</p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/marketplace")} className="w-full">
              Back to Marketplace
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (activating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activating Your Website...</h2>
          <p className="text-gray-600 mb-6">We're setting up your professional trainer website</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-[#D2FF28] h-2 rounded-full animate-pulse" style={{ width: "90%" }}></div>
          </div>
          <p className="text-sm text-gray-500">This will take just a moment...</p>
        </div>
      </div>
    )
  }

  // Calculate time remaining
  const expiresAt = new Date(trainer.expiresAt)
  const now = new Date()
  const timeRemaining = Math.max(0, expiresAt.getTime() - now.getTime())
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  const displayName = trainer.fullName || trainer.name

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Preview
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Timer className="h-4 w-4" />
              <span>
                Preview expires: {hoursRemaining}h {minutesRemaining}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Trainer Summary */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#D2FF28] rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-black" />
                  </div>
                  Activate Your Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{displayName}</h3>
                    <p className="text-gray-600">
                      {trainer.specialization} • {trainer.location}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Professional website generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Custom content & testimonials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mobile-responsive design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SEO optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Easy content editing</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>One-time activation fee:</span>
                      <span className="text-2xl text-[#D2FF28]">€29</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">No monthly fees • Lifetime access • Full ownership</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#D2FF28] border-[#D2FF28]">
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-2">🚀 What happens next?</h3>
                <div className="space-y-2 text-sm text-black">
                  <p>1. Complete payment securely with Stripe</p>
                  <p>2. Your website goes live instantly</p>
                  <p>3. Start editing content and accepting clients</p>
                  <p>4. Share your professional trainer URL</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <p className="text-sm text-gray-600">Secure payment powered by Stripe</p>
              </CardHeader>
              <CardContent>
                <StripePayment
                  amount="29"
                  description={`Trainer Website Activation - ${displayName}`}
                  onPaymentComplete={handlePaymentComplete}
                  onPaymentError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
