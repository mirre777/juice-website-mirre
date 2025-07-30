"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface TempTrainer {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
}

function CheckoutForm({ tempTrainer }: { tempTrainer: TempTrainer }) {
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

  const paymentElementOptions = {
    layout: "tabs" as const,
    business: {
      name: "Juice Fitness",
    },
    fields: {
      billingDetails: {
        name: "auto" as const,
        email: "auto" as const,
        address: {
          country: "auto" as const,
          postalCode: "auto" as const,
        },
      },
    },
    wallets: {
      applePay: "auto" as const,
      googlePay: "auto" as const,
    },
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Secure payment powered by Stripe</CardDescription>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Secure, 1-click checkout with Link
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Payment information</h3>
              <PaymentElement options={paymentElementOptions} />
            </div>

            {message && <div className="text-sm text-red-600 text-center">{message}</div>}

            <Button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              className="w-full bg-[#9EFF00] hover:bg-[#8FE600] text-black font-medium py-3"
            >
              {isLoading ? "Processing..." : "Pay €70"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
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
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const tempId = searchParams.get("tempId")
  const [clientSecret, setClientSecret] = useState<string>("")
  const [tempTrainer, setTempTrainer] = useState<TempTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tempId) {
      setError("No trainer ID provided")
      setLoading(false)
      return
    }

    const fetchTrainerAndCreatePaymentIntent = async () => {
      try {
        console.log("Fetching temp trainer with ID:", tempId)

        // Fetch temp trainer data
        const trainerResponse = await fetch(`/api/trainer/temp/${tempId}`)
        console.log("Trainer API response status:", trainerResponse.status)

        if (!trainerResponse.ok) {
          throw new Error(`Failed to fetch trainer: ${trainerResponse.status}`)
        }

        const trainerData = await trainerResponse.json()
        console.log("Trainer API response data:", trainerData)

        // Handle different response structures
        let trainer: TempTrainer
        if (trainerData.success && trainerData.trainer) {
          trainer = trainerData.trainer
        } else if (trainerData.id) {
          trainer = trainerData
        } else {
          throw new Error("Invalid trainer data structure")
        }

        console.log("Processed trainer data:", trainer)

        if (!trainer.id) {
          throw new Error("Trainer ID not found in response")
        }

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
        console.log("Payment intent created:", paymentData.paymentIntentId)

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-600 text-lg font-medium mb-2">Error</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tempTrainer || !clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load payment information</p>
        </div>
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
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <button onClick={() => window.history.back()} className="flex items-center text-gray-600 hover:text-gray-800">
            ← Back to Preview
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left side - Trainer info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-[#9EFF00] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <CardTitle>Activate Your Website</CardTitle>
                    <CardDescription>Complete your trainer profile activation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{tempTrainer.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">📧 {tempTrainer.email}</div>
                    {tempTrainer.phone && <div className="flex items-center gap-2">📱 {tempTrainer.phone}</div>}
                    {tempTrainer.location && <div className="flex items-center gap-2">📍 {tempTrainer.location}</div>}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Professional website generated</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Custom content & testimonials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Mobile-responsive design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">SEO optimized</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Easy content editing</span>
                  </div>
                </div>

                <div className="bg-black text-white p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm opacity-80">One-time activation fee:</div>
                      <div className="text-xs opacity-60">No monthly fees • Lifetime access • Full ownership</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#9EFF00]">€70</div>
                      <div className="text-xs opacity-60">ONE-TIME</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Payment form */}
          <div className="flex items-start justify-center">
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm tempTrainer={tempTrainer} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}
