"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useSearchParams } from "next/navigation"

export default function StripePayment() {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentIntentSecret, setPaymentIntentSecret] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const tempId = searchParams.get("tempId")

  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tempId: tempId,
            email: "", // Add email if available
          }),
        })

        const { clientSecret } = await response.json()
        setPaymentIntentSecret(clientSecret)
      } catch (error: any) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [tempId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment/success`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setErrorMessage(error.message || "An unexpected error occurred.")
    } else {
      setErrorMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "tabs",
  }

  return (
    <form onSubmit={handleSubmit}>
      {paymentIntentSecret && <PaymentElement id="payment-element" options={paymentElementOptions} />}
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {errorMessage && (
        <div id="payment-message" className="text-red-500">
          {errorMessage}
        </div>
      )}
    </form>
  )
}
