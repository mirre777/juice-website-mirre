"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

// Use the environment variable for the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// API URL for your separate API project
const getApiUrl = () => {
  // For local development and testing
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    return "/api"
  }

  // For production
  return "/api" // Use relative URL to avoid CORS issues
}

interface StripePaymentProps {
  tempId?: string
  onPaymentComplete: () => void
  onPaymentError: (error: string) => void
  resetCounter?: number // Add a reset counter prop to force re-render
}

export function StripePayment({ tempId, onPaymentComplete, onPaymentError, resetCounter = 0 }: StripePaymentProps) {
  const { isCoach } = useTheme()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Use a ref to track if we've already created a payment intent
  const paymentIntentCreated = useRef(false)

  // Create a unique key for this instance that changes when resetCounter changes
  const elementsKey = `stripe-elements-${resetCounter}`

  useEffect(() => {
    // Add a small delay before creating the payment intent to ensure smooth UI
    const timer = setTimeout(() => {
      console.log(`Creating new payment intent with key: ${elementsKey}`)
      let isMounted = true

      // Call our API to create a payment intent
      const createPaymentIntent = async () => {
        try {
          if (!isMounted) return

          setLoading(true)
          setError(null)

          const apiUrl = getApiUrl()
          console.log(`Attempting to create payment intent using API: ${apiUrl}/create-payment-intent`)

          // Use relative URL to avoid CORS issues
          const response = await fetch(`${apiUrl}/create-payment-intent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tempId: tempId,
              email: "", // Will be collected in the form
            }),
          })

          if (!isMounted) return

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Error response:", errorText)
            throw new Error(`Failed to create payment intent: ${response.status} ${response.statusText}`)
          }

          const data = await response.json()
          console.log(
            "Payment intent created successfully:",
            data.clientSecret ? "Secret received" : "No secret received",
            "Payment Intent ID:",
            data.paymentIntentId,
          )

          if (!isMounted) return

          setClientSecret(data.clientSecret)
          setPaymentIntentId(data.paymentIntentId)
          setLoading(false)
        } catch (error) {
          if (!isMounted) return

          console.error("Error creating payment intent:", error)

          // Set detailed error message
          const errorMessage =
            error instanceof Error ? error.message : "Failed to initialize payment. Please try again."

          setError(errorMessage)
          onPaymentError(errorMessage)
          setLoading(false)
        }
      }

      createPaymentIntent()

      return () => {
        isMounted = false
      }
    }, 200) // 200ms delay before creating payment intent

    return () => clearTimeout(timer)
  }, [tempId, onPaymentError, elementsKey, resetCounter])

  // Reset the payment intent creation flag when resetCounter changes
  useEffect(() => {
    paymentIntentCreated.current = false
  }, [resetCounter])

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-juice border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading payment options...
          </span>
        </div>
        <p className={`mt-4 text-lg font-medium ${isCoach ? "text-black" : "text-white"}`}>
          Loading payment options...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className={`text-lg font-medium text-red-500`}>{error}</p>
        <p className={`mt-2 ${isCoach ? "text-black" : "text-white"}`}>Please try again later or contact support.</p>
        <Button
          onClick={() => {
            paymentIntentCreated.current = false
            setError(null)
            setLoading(true)
            // Force re-creation of payment intent
            const createPaymentIntent = async () => {
              try {
                const apiUrl = getApiUrl()
                const response = await fetch(`${apiUrl}/create-payment-intent`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    tempId: tempId,
                    email: "",
                  }),
                })

                if (!response.ok) {
                  const errorText = await response.text()
                  throw new Error(`Failed to create payment intent: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()
                setClientSecret(data.clientSecret)
                setPaymentIntentId(data.paymentIntentId)
                setLoading(false)
              } catch (error) {
                const errorMessage =
                  error instanceof Error ? error.message : "Failed to initialize payment. Please try again."
                setError(errorMessage)
                onPaymentError(errorMessage)
                setLoading(false)
              }
            }
            createPaymentIntent()
          }}
          className="mt-4 bg-juice text-black hover:bg-juice/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="py-8 text-center">
        <p className={`text-lg font-medium ${isCoach ? "text-black" : "text-white"}`}>
          Unable to initialize payment. Please try again later.
        </p>
        <Button
          onClick={() => {
            paymentIntentCreated.current = false
            window.location.reload()
          }}
          className="mt-4 bg-juice text-black hover:bg-juice/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Elements
      key={elementsKey}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#ffcc00",
            colorBackground: isCoach ? "#ffffff" : "#000000",
            colorText: isCoach ? "#000000" : "#ffffff",
          },
        },
      }}
    >
      <CheckoutForm
        tempId={tempId}
        onPaymentComplete={onPaymentComplete}
        onPaymentError={onPaymentError}
        paymentIntentId={paymentIntentId}
      />
    </Elements>
  )
}

// Separate the checkout form into its own component
function CheckoutForm({
  tempId,
  onPaymentComplete,
  onPaymentError,
  paymentIntentId,
}: StripePaymentProps & { paymentIntentId?: string | null }) {
  const stripe = useStripe()
  const elements = useElements()
  const { isCoach } = useTheme()
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [elementsReady, setElementsReady] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet")
      setPaymentError("Payment system is still initializing. Please try again in a moment.")
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    if (!elements) {
      console.error("Elements not available")
      setPaymentError("Payment form not ready. Please wait a moment and try again.")
      return
    }

    const paymentElement = elements.getElement("payment")
    if (!paymentElement) {
      console.error("PaymentElement not found")
      setPaymentError("Payment form not loaded properly. Please refresh and try again.")
      return
    }

    try {
      if (!email) {
        throw new Error("Please provide an email address for your receipt")
      }

      // Confirm the payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_intent=${paymentIntentId || ""}&tempId=${tempId || ""}`,
          receipt_email: email,
        },
        redirect: "if_required",
      })

      if (result.error) {
        console.error("Payment confirmation error:", result.error)
        throw new Error(result.error.message || "Payment failed. Please try again.")
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        localStorage.setItem("juice_payment_reference", result.paymentIntent.id)
        localStorage.setItem("juice_user_email", email)

        // Update payment metadata with email
        try {
          const apiUrl = getApiUrl()
          await fetch(`${apiUrl}/update-payment-metadata`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentIntentId: result.paymentIntent.id,
              email: email,
            }),
          })
          console.log("Payment metadata updated with email")
        } catch (error) {
          console.error("Failed to update payment metadata:", error)
          // Continue with payment flow even if this fails
        }

        onPaymentComplete()
        window.location.href = `${window.location.origin}/payment/success?payment_intent=${result.paymentIntent.id}&tempId=${tempId || ""}`
      } else {
        console.log("Payment requires additional action or is processing")
      }
    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      setPaymentError(errorMessage)
      onPaymentError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  // Render a simple message if Stripe or Elements is not available
  if (!stripe || !elements) {
    return (
      <div className="py-4 text-center">
        <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Loading payment form...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{paymentError}</p>
        </div>
      )}

      <PaymentElement
        onReady={() => {
          console.log("PaymentElement is ready")
          setElementsReady(true)
        }}
        options={{
          layout: "tabs",
        }}
      />

      <div className="space-y-2">
        <label htmlFor="email" className={`block text-sm font-medium ${isCoach ? "text-gray-700" : "text-gray-300"}`}>
          Email for receipt
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`block w-full px-3 py-2 border ${isCoach ? "border-gray-300" : "border-gray-700"} rounded-md shadow-sm focus:outline-none focus:ring-juice focus:border-juice ${isCoach ? "bg-white text-black" : "bg-black text-white"}`}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing || !elementsReady}
        className="w-full bg-juice text-black hover:bg-juice/90"
      >
        {isProcessing ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            Processing...
          </>
        ) : (
          `Pay €69`
        )}
      </Button>
    </form>
  )
}

// Direct payment link component
export function StripePaymentLink() {
  const { isCoach } = useTheme()

  return (
    <div className="text-center py-4">
      <p className={`mb-4 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Prefer to pay directly through Stripe?</p>
      <Button
        onClick={() => {
          window.open(
            "https://buy.stripe.com/6oE6qj189dmC9q0aEE?success_url=" +
              encodeURIComponent(`${window.location.origin}/payment/success`) +
              "&cancel_url=" +
              encodeURIComponent(`${window.location.origin}/payment?canceled=true`),
            "_blank",
          )
        }}
        className="bg-[#635BFF] hover:bg-[#635BFF]/90 text-white"
      >
        Pay with Stripe Checkout
      </Button>
    </div>
  )
}
