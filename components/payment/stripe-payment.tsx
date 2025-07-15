"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentProps {
  tempId: string
  token: string
  trainerName: string
  trainerEmail: string
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({
  tempId,
  token,
  trainerName,
  trainerEmail,
  amount,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [email, setEmail] = useState(trainerEmail)

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: "eur",
        tempId,
        token,
        trainerName,
        trainerEmail: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          onError(data.error || "Failed to create payment intent")
        }
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error)
        onError("Failed to initialize payment")
      })
  }, [amount, tempId, token, trainerName, email, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?tempId=${tempId}&token=${encodeURIComponent(token)}`,
          receipt_email: email,
        },
        redirect: "if_required",
      })

      if (error) {
        console.error("Payment error:", error)
        onError(error.message || "Payment failed")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id)
        onSuccess(paymentIntent.id)
      }
    } catch (error) {
      console.error("Payment confirmation error:", error)
      onError("Payment confirmation failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Initializing payment...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <p className="text-sm text-muted-foreground">Secure payment powered by Stripe</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
              fields: {
                billingDetails: {
                  name: "auto",
                  email: "never", // We handle email separately
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
              promotionCodes: {
                enabled: true,
              },
              terms: {
                card: "never",
              },
            }}
          />

          <Button type="submit" disabled={!stripe || isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay €${amount}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function StripePayment(props: StripePaymentProps) {
  const options = {
    clientSecret: "", // This will be set in CheckoutForm
    appearance: {
      theme: "stripe" as const,
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
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
