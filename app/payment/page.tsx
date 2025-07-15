"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, ArrowLeft } from "lucide-react"
import { StripePayment } from "@/components/payment/stripe-payment"
import { useTheme } from "@/components/theme-provider"

interface TrainerData {
  id: string
  name: string
  fullName?: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio?: string
  certifications?: string[]
  status: string
  createdAt: string
  expiresAt: string
  hasSessionToken: boolean
}

function PaymentPageContent() {
  const { isCoach } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tempId = searchParams.get("tempId")
  const token = searchParams.get("token")

  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentResetCounter, setPaymentResetCounter] = useState(0)

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (!tempId) {
        setError("No trainer ID provided")
        setLoading(false)
        return
      }

      if (!token) {
        setError("No access token provided")
        setLoading(false)
        return
      }

      try {
        console.log("Fetching trainer data for:", tempId, "with token:", token?.substring(0, 10) + "...")
        const response = await fetch(`/api/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch trainer data")
        }

        const data = await response.json()
        console.log("Trainer data received:", data)

        if (data.success && data.trainer) {
          setTrainerData(data.trainer)
        } else {
          throw new Error("Invalid trainer data received")
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error)
        setError(error instanceof Error ? error.message : "Failed to load trainer data")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerData()
  }, [tempId, token])

  const handlePaymentComplete = () => {
    console.log("Payment completed successfully")
    // Payment success will be handled by Stripe redirect
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    setPaymentError(error)
    // Reset payment component to try again
    setPaymentResetCounter((prev) => prev + 1)
  }

  const handleGoBack = () => {
    if (tempId && token) {
      router.push(`/marketplace/trainer/temp/${tempId}?token=${encodeURIComponent(token)}`)
    } else {
      router.back()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice mx-auto mb-4"></div>
          <p className={`text-lg ${isCoach ? "text-black" : "text-white"}`}>Loading trainer information...</p>
        </div>
      </div>
    )
  }

  if (error || !trainerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || "Trainer data not found"}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full bg-juice text-black hover:bg-juice/90">
                Try Again
              </Button>
              <Button onClick={handleGoBack} variant="outline" className="w-full bg-transparent">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${isCoach ? "bg-white" : "bg-black"}`}>
      {/* Header with Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className={`flex items-center gap-2 ${isCoach ? "text-black hover:bg-gray-100" : "text-white hover:bg-gray-800"}`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Preview
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Trainer Info */}
          <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isCoach ? "text-black" : "text-white"}`}>
                <div className="w-8 h-8 bg-juice rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">⚡</span>
                </div>
                Activate Your Website
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trainer Details */}
              <div>
                <h3 className={`text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
                  {trainerData.fullName || trainerData.name}
                </h3>
                <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} flex items-center gap-2 mt-1`}>
                  <Award className="w-4 h-4" />
                  {trainerData.specialization} • {trainerData.experience} • {trainerData.location}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  "Professional website generated",
                  "Custom content & testimonials",
                  "Mobile-responsive design",
                  "SEO optimized",
                  "Easy content editing",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className={`${isCoach ? "text-gray-700" : "text-gray-300"}`}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-semibold ${isCoach ? "text-black" : "text-white"}`}>
                      One-time activation fee:
                    </h4>
                    <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                      No monthly fees • Lifetime access • Full ownership
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-juice">€69</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Payment */}
          <Card className={`${isCoach ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"}`}>
            <CardHeader>
              <CardTitle className={`${isCoach ? "text-black" : "text-white"}`}>Complete Your Payment</CardTitle>
              <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                Secure payment powered by Stripe
              </p>
            </CardHeader>
            <CardContent>
              {paymentError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{paymentError}</p>
                </div>
              )}

              <StripePayment
                tempId={tempId || ""}
                onPaymentComplete={handlePaymentComplete}
                onPaymentError={handlePaymentError}
                resetCounter={paymentResetCounter}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juice"></div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
