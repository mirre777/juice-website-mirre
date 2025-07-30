"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, CreditCard, Shield, ArrowLeft } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

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

function CheckoutForm({
  tempTrainer,
  email,
  setEmail,
}: {
  tempTrainer: TempTrainerData
  email: string
  setEmail: (email: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      console.log("=== PROCESSING PAYMENT ===")
      console.log("Temp Trainer:", tempTrainer)
      console.log("Email:", email)

      // Confirm payment using PaymentElement
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_intent_id={PAYMENT_INTENT_ID}&tempId=${tempTrainer.id}`,
          receipt_email: email,
        },
        redirect: "if_required",
      })

      if (error) {
        console.error("Payment failed:", error)
        alert("Payment failed: " + error.message)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent)
        // Redirect to success page
        router.push(`/payment/success?payment_intent=${paymentIntent.id}`)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
        <Shield className="h-4 w-4" />
        <span>Secure, 1-click checkout with Link</span>
      </div>

      <div className="space-y-4">
        {/* PaymentElement with enhanced options */}
        <div>
          <Label htmlFor="payment">Payment information</Label>
          <div className="mt-1">
            <PaymentElement
              options={{
                layout: {
                  type: "tabs",
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: false,
                },
                // Enable promotion codes
                promotionCodes: {
                  enabled: true,
                },
                // Configure payment method creation
                paymentMethodCreation: "manual",
                // Enable all available payment methods
                paymentMethodOrder: [
                  "card",
                  "paypal",
                  "ideal",
                  "sofort",
                  "bancontact",
                  "giropay",
                  "eps",
                  "p24",
                  "sepa_debit",
                ],
                // Configure fields
                fields: {
                  billingDetails: {
                    name: "auto",
                    email: "auto",
                    phone: "auto",
                    address: {
                      country: "auto",
                      line1: "auto",
                      line2: "auto",
                      city: "auto",
                      state: "auto",
                      postalCode: "auto",
                    },
                  },
                },
                // Configure terms
                terms: {
                  card: "auto",
                  ideal: "auto",
                  sepaDebit: "auto",
                  sofort: "auto",
                  bancontact: "auto",
                  giropay: "auto",
                  eps: "auto",
                  p24: "auto",
                  paypal: "auto",
                },
                // Enable wallets
                wallets: {
                  applePay: "auto",
                  googlePay: "auto",
                },
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email for receipt</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-[#D2FF28] text-black hover:bg-[#c5f01f] text-lg py-6"
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay €70`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By completing your purchase, you agree to our terms of service.
      </p>
    </form>
  )
}

function PaymentForm({ tempTrainer }: { tempTrainer: TempTrainerData }) {
  const router = useRouter()
  const [email, setEmail] = useState(tempTrainer?.email || "")
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create payment intent on component mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log("=== CREATING PAYMENT INTENT ===")
        console.log("Temp Trainer:", tempTrainer)
        console.log("Email:", email)

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tempId: tempTrainer.id,
            email: email,
          }),
        })

        const data = await response.json()

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
          setLoading(false)
        } else {
          throw new Error("Failed to create payment intent")
        }
      } catch (error) {
        console.error("Payment intent creation error:", error)
        setError("Failed to initialize payment. Please try again.")
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [tempTrainer])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment form...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Preview</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Trainer Info */}
          <div>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                <div className="w-12 h-12 bg-[#D2FF28] rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Activate Your Website</CardTitle>
                  <p className="text-gray-600 text-sm">Complete your trainer profile activation</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{tempTrainer.fullName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {tempTrainer.experience}
                      </Badge>
                      <span>•</span>
                      <span>{tempTrainer.location}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Professional website generated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom content & testimonials</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mobile-responsive design</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">SEO optimized</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Easy content editing</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">One-time activation fee:</p>
                        <p className="text-sm text-gray-600">No monthly fees • Lifetime access • Full ownership</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[#D2FF28] bg-black px-3 py-1 rounded">€70</p>
                        <p className="text-xs text-gray-500 mt-1">ONE-TIME</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Complete Your Payment</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Secure payment powered by Stripe</p>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#D2FF28",
                          colorBackground: "#ffffff",
                          colorText: "#000000",
                          colorDanger: "#df1b41",
                          fontFamily: "system-ui, sans-serif",
                          spacingUnit: "4px",
                          borderRadius: "8px",
                        },
                      },
                      // Enable locale for better UX
                      locale: "auto",
                    }}
                  >
                    <CheckoutForm tempTrainer={tempTrainer} email={email} setEmail={setEmail} />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tempTrainer, setTempTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tempId = searchParams.get("tempId")

  useEffect(() => {
    if (!tempId) {
      setError("No trainer ID provided")
      setLoading(false)
      return
    }

    const fetchTempTrainer = async () => {
      try {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
        const apiUrl = `${baseUrl}/api/trainer/temp/${tempId}`

        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to load trainer data")
          setLoading(false)
          return
        }

        if (data.success && data.trainer) {
          setTempTrainer(data.trainer)
        } else {
          setError(data.error || "Failed to load trainer data")
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching temp trainer:", err)
        setError("Failed to load trainer data")
        setLoading(false)
      }
    }

    fetchTempTrainer()
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    )
  }

  if (error || !tempTrainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
                  Back to Marketplace
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <PaymentForm tempTrainer={tempTrainer} />
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment page...</p>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
