"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TempTrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  status: string
  createdAt: string
}

function CheckoutForm({ tempTrainer }: { tempTrainer: TempTrainerData }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?tempId=${tempTrainer.id}`,
      },
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred")
      } else {
        setMessage("An unexpected error occurred.")
      }
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment information</h3>
        <PaymentElement
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: false,
            },
            // Remove paymentMethodOrder to let Stripe decide the best order
            fields: {
              billingDetails: {
                name: "auto",
                email: "auto",
                phone: "never", // Simplify the form
                address: {
                  country: "auto",
                  line1: "never",
                  line2: "never",
                  city: "never",
                  state: "never",
                  postalCode: "never",
                },
              },
            },
            // Enable all wallet options
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
            // Enable business name for better UX
            business: {
              name: "Juice Fitness",
            },
          }}
        />
      </div>

      {message && <div className="text-red-600 text-sm">{message}</div>}

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#c4ff4d] hover:bg-[#b8f041] text-black font-medium py-3 text-lg"
      >
        {isLoading ? "Processing..." : "Pay €70"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By completing your purchase, you agree to our terms of service.
      </p>
    </form>
  )
}

function PaymentForm({ tempTrainer }: { tempTrainer: TempTrainerData }) {
  const [clientSecret, setClientSecret] = useState<string>("")
  const [isCreatingIntent, setIsCreatingIntent] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("=== CREATING PAYMENT INTENT ===")
        console.log("Temp Trainer:", tempTrainer)
        console.log("Temp Trainer ID:", tempTrainer.id)
        console.log("Email:", tempTrainer.email)

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tempId: tempTrainer.id,
            email: tempTrainer.email,
          }),
        })

        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API Error:", errorData)
          throw new Error(errorData.error || "Failed to create payment intent")
        }

        const data = await response.json()
        console.log("Payment intent created:", data.paymentIntentId)
        setClientSecret(data.clientSecret)
      } catch (err: any) {
        console.error("Payment intent creation error:", err)
        setError(err.message || "Failed to initialize payment")
      } finally {
        setIsCreatingIntent(false)
      }
    }

    if (tempTrainer && tempTrainer.id) {
      createPaymentIntent()
    } else {
      console.error("No tempTrainer or tempTrainer.id:", tempTrainer)
      setError("Missing trainer information")
      setIsCreatingIntent(false)
    }
  }, [tempTrainer])

  if (isCreatingIntent) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to initialize payment. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#c4ff4d",
      colorBackground: "#ffffff",
      colorText: "#000000",
      colorDanger: "#df1b41",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  }

  const options = {
    clientSecret,
    appearance,
    loader: "auto" as const,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm tempTrainer={tempTrainer} />
    </Elements>
  )
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const [tempTrainer, setTempTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const plan = searchParams.get("plan")
  const tempId = searchParams.get("tempId")

  useEffect(() => {
    const fetchTempTrainer = async () => {
      if (!tempId) {
        setError("No trainer ID provided")
        setLoading(false)
        return
      }

      try {
        console.log("=== FETCHING TEMP TRAINER FOR PAYMENT ===")
        console.log("Search params: plan=" + plan + "&tempId=" + tempId)
        console.log("TempId from params:", tempId)

        const response = await fetch(`/api/trainer/temp/${tempId}`)

        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)

        if (!response.ok) {
          throw new Error("Failed to fetch trainer data")
        }

        const data = await response.json()
        console.log("=== API RESPONSE DATA ===")
        console.log("Full response:", data)

        // Check if the response has the expected structure
        if (data.success && data.trainer) {
          console.log("Success and trainer data found")
          console.log("Setting temp trainer for payment:", data.trainer)
          setTempTrainer(data.trainer)
        } else if (data.id) {
          // If the response is directly the trainer object
          console.log("Direct trainer object found")
          console.log("Setting temp trainer for payment:", data)
          setTempTrainer(data)
        } else {
          console.error("Unexpected response structure:", data)
          throw new Error("Invalid trainer data structure")
        }
      } catch (err: any) {
        console.error("Error fetching temp trainer:", err)
        setError(err.message || "Failed to load trainer data")
      } finally {
        setLoading(false)
      }
    }

    fetchTempTrainer()
  }, [tempId, plan])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !tempTrainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Trainer not found"}</p>
          <Link href="/marketplace/personal-trainer-website">
            <Button>Back to Preview</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href={`/marketplace/trainer/temp/${tempTrainer.id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Preview
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Trainer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#c4ff4d] rounded-full flex items-center justify-center">
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
                <h3 className="font-semibold text-lg mb-2">{tempTrainer.fullName}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📧 {tempTrainer.email}</p>
                  {tempTrainer.phone && <p>📱 {tempTrainer.phone}</p>}
                  <p>📍 {tempTrainer.location}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Professional website generated</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Custom content & testimonials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Mobile-responsive design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">SEO optimized</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Easy content editing</span>
                </div>
              </div>

              <div className="bg-black text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">One-time activation fee:</p>
                    <p className="text-xs text-gray-400">No monthly fees • Lifetime access • Full ownership</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#c4ff4d]">€70</div>
                    <div className="text-xs text-gray-400">ONE-TIME</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Payment Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <CardTitle className="text-xl">Complete Your Payment</CardTitle>
              </div>
              <p className="text-gray-600">Secure payment powered by Stripe</p>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Secure, 1-click checkout with Link</span>
              </div>
            </CardHeader>
            <CardContent>
              <PaymentForm tempTrainer={tempTrainer} />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
