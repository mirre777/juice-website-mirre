"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard, Mail, Phone, MapPin } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TempTrainer {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  specialties?: string[]
  bio?: string
  experience?: string
  certifications?: string[]
  pricing?: {
    sessionRate?: number
    packageDeals?: string[]
  }
  availability?: {
    days?: string[]
    times?: string[]
  }
  createdAt: string
  status: "pending" | "active"
}

function PaymentForm({ tempTrainer }: { tempTrainer: TempTrainer }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elementError, setElementError] = useState<string | null>(null)

  useEffect(() => {
    console.log("💳 PaymentForm component mounted")
    console.log("🔑 Stripe instance:", !!stripe)
    console.log("🧩 Elements instance:", !!elements)

    // Check if promotion codes are working after a delay
    const timer = setTimeout(() => {
      console.log("🔍 Checking for promotion code elements in DOM...")
      const promoElements = document.querySelectorAll(
        '[data-testid*="promo"], [class*="promo"], [class*="coupon"], [class*="discount"]',
      )
      console.log("📋 Found promotion-related elements:", promoElements.length)
      promoElements.forEach((el, index) => {
        console.log(`Element ${index}:`, el)
      })

      // Check for "Add promotion code" text
      const addPromoText = document.querySelector('*:contains("Add promotion code")')
      console.log("🏷️ Found 'Add promotion code' text:", !!addPromoText)

      // Check Stripe Elements iframe
      const stripeFrames = document.querySelectorAll('iframe[name^="__privateStripeFrame"]')
      console.log("🖼️ Stripe iframes found:", stripeFrames.length)

      // Check current domain
      console.log("🌐 Current domain:", window.location.hostname)
      console.log("⚠️ Make sure this domain is added to Stripe Dashboard > Payment method domains")
    }, 2000)

    return () => clearTimeout(timer)
  }, [stripe, elements])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || "An error occurred")
      setIsLoading(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?tempId=${tempTrainer.id}`,
      },
    })

    if (confirmError) {
      setError(confirmError.message || "Payment failed")
      setIsLoading(false)
    }
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
    business: {
      name: "Juice Fitness",
    },
    fields: {
      billingDetails: {
        name: "auto" as const,
        email: "auto" as const,
        address: "auto" as const,
      },
    },
    promotionCodes: {
      enabled: true,
    },
  }

  console.log("🎯 Promotion codes enabled:", paymentElementOptions.promotionCodes.enabled)
  console.log("🚀 About to render PaymentElement with promotion codes")

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {elementError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{elementError}</p>
        </div>
      )}

      {(() => {
        try {
          return <PaymentElement options={paymentElementOptions} />
        } catch (error) {
          console.error("❌ Error rendering PaymentElement:", error)
          setElementError(error instanceof Error ? error.message : "Unknown error")
          return null
        }
      })()}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#9EFF00] hover:bg-[#8FE600] text-black font-semibold py-3 text-lg"
      >
        {isLoading ? "Processing..." : "Pay €70"}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        By completing your purchase, you agree to our{" "}
        <a
          href="https://www.juice.fitness/legal?tab=terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          terms of service
        </a>
        .
      </p>
    </form>
  )
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const [tempTrainer, setTempTrainer] = useState<TempTrainer | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tempId = searchParams.get("tempId")
  const plan = searchParams.get("plan")

  useEffect(() => {
    const fetchTrainerAndCreatePaymentIntent = async () => {
      if (!tempId) {
        setError("Trainer ID is required")
        setLoading(false)
        return
      }

      try {
        console.log("Fetching temp trainer data for:", tempId)

        // Fetch temp trainer data
        const trainerResponse = await fetch(`/api/trainer/temp/${tempId}`)
        console.log("Trainer API response status:", trainerResponse.status)

        if (!trainerResponse.ok) {
          throw new Error(`Failed to fetch trainer data: ${trainerResponse.status}`)
        }

        const trainerData = await trainerResponse.json()
        console.log("Trainer API response:", trainerData)

        let trainer: TempTrainer
        if (trainerData.success && trainerData.trainer) {
          trainer = trainerData.trainer
        } else if (trainerData.id) {
          trainer = trainerData
        } else {
          throw new Error("Invalid trainer data structure")
        }

        if (!trainer.id) {
          throw new Error("Trainer ID not found in response")
        }

        console.log("Setting temp trainer:", trainer)
        setTempTrainer(trainer)

        // Create payment intent
        console.log("Creating payment intent for trainer:", trainer.id)
        const paymentResponse = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tempId: trainer.id,
            email: trainer.email,
          }),
        })

        console.log("Payment intent response status:", paymentResponse.status)

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json()
          throw new Error(errorData.error || "Failed to create payment intent")
        }

        const paymentData = await paymentResponse.json()
        console.log("Payment intent created successfully")
        setClientSecret(paymentData.clientSecret)
      } catch (err) {
        console.error("Error in fetchTrainerAndCreatePaymentIntent:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerAndCreatePaymentIntent()
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9EFF00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#9EFF00] hover:bg-[#8FE600] text-black">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tempTrainer || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600">Unable to load payment information</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#9EFF00",
        colorBackground: "#ffffff",
        colorText: "#1a1a1a",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  console.log("🎨 Stripe Elements initialized")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Preview
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Trainer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#9EFF00] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-xl">Activate Your Website</CardTitle>
                  <p className="text-gray-600">Complete your trainer profile activation</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{tempTrainer.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {tempTrainer.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{tempTrainer.email}</span>
                    </div>
                  )}
                  {tempTrainer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{tempTrainer.phone}</span>
                    </div>
                  )}
                  {tempTrainer.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{tempTrainer.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Professional website generated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Custom content & testimonials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Mobile-responsive design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">SEO optimized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Easy content editing</span>
                </div>
              </div>

              <div className="bg-black text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">One-time activation fee:</p>
                    <p className="text-xs opacity-60">No monthly fees • Lifetime access • Full ownership</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#9EFF00]">€70</p>
                    <p className="text-xs opacity-60">ONE-TIME</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Payment */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <div>
                  <CardTitle className="text-xl">Complete Your Payment</CardTitle>
                  <p className="text-gray-600">Secure payment powered by Stripe</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Secure, 1-click checkout with Link</span>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-4">Payment information</h3>
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm tempTrainer={tempTrainer} />
              </Elements>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9EFF00] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
