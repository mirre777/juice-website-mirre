"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRPayment } from "@/components/payment/qr-payment"
import { useTheme } from "@/components/theme-provider"
import { PaymentSuccess } from "./payment-success"
import { StripePayment, StripePaymentLink } from "./stripe-payment"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PaymentModalProps {
  triggerText?: string
  amount?: string
  description?: string
  children?: React.ReactNode
  onPaymentComplete?: () => void
  planName?: string
}

export function PaymentModal({
  triggerText = "Pay Now",
  amount = "29.99",
  description = "Juice Premium Subscription",
  children,
  onPaymentComplete,
  planName = "Premium",
}: PaymentModalProps) {
  const { isCoach } = useTheme()
  const [open, setOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "error" | "verifying" | "failed"
  >("pending")
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "stripe">("stripe")
  const [errorMessage, setErrorMessage] = useState("")
  const [resetCounter, setResetCounter] = useState(0) // Counter to force re-render
  const [stripeVisible, setStripeVisible] = useState(false) // Control when Stripe component is mounted
  const [loading, setLoading] = useState(false)

  // Reset all states when the modal opens
  useEffect(() => {
    if (open) {
      setPaymentStatus("pending")
      setPaymentMethod("stripe")
      setErrorMessage("")
      // Show loading state immediately
      setLoading(true)
      // Only show Stripe component after a short delay to prevent multiple renders
      setStripeVisible(false)
      setTimeout(() => {
        setStripeVisible(true)
        // Keep loading state for a bit longer to ensure Stripe is fully initialized
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }, 100)
    } else {
      // Hide Stripe component when modal is closed
      setStripeVisible(false)
      setLoading(false)
    }
  }, [open])

  const handlePaymentComplete = () => {
    // Change to verification state instead of auto-success
    setPaymentStatus("verifying")

    // In a real app, this would call a server endpoint to initiate payment verification
    // For demo purposes, we'll simulate the verification process
    setTimeout(() => {
      // This would be replaced with actual verification logic
      verifyPayment(amount, description)
    }, 1000)
  }

  // Add a new function to verify payment with the server
  const verifyPayment = async (amount: string, description: string) => {
    try {
      // In a real implementation, this would be an API call to your backend
      // const response = await fetch('/api/payments/verify-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, description, user_id: currentUser.id })
      // });
      // const data = await response.json();

      // Simulate API response for demo purposes
      const simulateVerification = Math.random() > 0.3 // 70% success rate for demo

      if (simulateVerification) {
        setPaymentStatus("success")
        // Call the onPaymentComplete callback if provided
        if (onPaymentComplete) {
          onPaymentComplete()
        }
      } else {
        setPaymentStatus("failed")
      }
    } catch (error) {
      console.error("Payment verification failed:", error)
      setPaymentStatus("failed")
    }
  }

  const handleStripePaymentComplete = () => {
    setPaymentStatus("success")
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  const handleStripePaymentError = (error: string) => {
    setErrorMessage(error)
    setPaymentStatus("failed")
  }

  // Update the handleClose function to properly reset all states
  const handleClose = () => {
    // Reset payment status when dialog is closed
    setTimeout(() => {
      setPaymentStatus("pending")
      setPaymentMethod("stripe")
      setErrorMessage("")
      setResetCounter(0) // Reset the counter
      setStripeVisible(false) // Hide Stripe component
    }, 300) // Small delay to ensure the modal is closed first
    setOpen(false)
  }

  // Function to reset the payment form
  const resetPaymentForm = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Resetting payment form")
    }
    setPaymentStatus("pending")
    setErrorMessage("")
    // Increment the counter to force re-render
    setResetCounter((prev) => prev + 1)
    // Re-mount the Stripe component
    setStripeVisible(false)
    setTimeout(() => {
      setStripeVisible(true)
    }, 100)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) handleClose()
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <button className="trainer-gradient-btn font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2">
            {triggerText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${isCoach ? "bg-white" : "bg-zinc-900 border-zinc-800"}`}>
        {paymentStatus === "pending" && (
          <>
            <DialogHeader>
              <DialogTitle className={isCoach ? "text-black" : "text-white"}>Complete Payment</DialogTitle>
              <DialogDescription className={isCoach ? "text-gray-600" : "text-gray-400"}>
                Choose your preferred payment method
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="stripe"
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "bank" | "stripe")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stripe">Credit Card</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              </TabsList>

              <TabsContent value="stripe" className="py-4">
                {loading && (
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
                )}
                {/* Only render the StripePayment component when the tab is active and stripeVisible is true */}
                {!loading && stripeVisible && paymentMethod === "stripe" && (
                  <StripePayment
                    resetCounter={resetCounter}
                    amount={amount}
                    description={description}
                    onPaymentComplete={handleStripePaymentComplete}
                    onPaymentError={handleStripePaymentError}
                  />
                )}
                <div className="mt-6 pt-4 border-t">
                  <StripePaymentLink />
                </div>
              </TabsContent>

              <TabsContent value="bank">
                <div className="flex justify-center py-4">
                  <QRPayment
                    defaultAmount={amount}
                    description={description}
                    recipientName="Juice Fitness GmbH"
                    recipientIBAN="AT123456789012345678"
                    onPaymentComplete={handlePaymentComplete}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {paymentStatus === "processing" && (
          <div className="py-8 text-center">
            <div
              className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-juice border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Processing payment...
              </span>
            </div>
            <p className={`mt-4 text-lg font-medium ${isCoach ? "text-black" : "text-white"}`}>
              Processing your payment...
            </p>
            <p className={`mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Please wait while we verify your payment.
            </p>
          </div>
        )}

        {paymentStatus === "verifying" && (
          <div className="py-8 text-center">
            <div
              className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-juice border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Verifying payment...
              </span>
            </div>
            <p className={`mt-4 text-lg font-medium ${isCoach ? "text-black" : "text-white"}`}>
              Verifying your payment...
            </p>
            <p className={`mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Please wait while we confirm your payment with our bank. This may take a moment.
            </p>
          </div>
        )}

        {paymentStatus === "success" && <PaymentSuccess planName={planName} />}

        {paymentStatus === "failed" && (
          <div className="py-8 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isCoach ? "bg-red-100" : "bg-red-900/30"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className={`mt-6 text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>Payment Failed</h3>
            <p className={`mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              {errorMessage || "We couldn't process your payment."}
            </p>

            {paymentMethod === "bank" && (
              <ul className={`mt-4 text-left mx-auto max-w-xs ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                <li className="flex items-start gap-2 mb-2">
                  <span>•</span>
                  <span>The payment hasn't been processed by your bank yet</span>
                </li>
                <li className="flex items-start gap-2 mb-2">
                  <span>•</span>
                  <span>The payment details don't match our records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>There was a technical issue with our verification system</span>
                </li>
              </ul>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <Button onClick={resetPaymentForm} variant="outline" className={isCoach ? "" : "border-zinc-700"}>
                Try Again
              </Button>
              <Button
                onClick={() => window.open("mailto:support@juicefitness.com", "_blank")}
                className="trainer-gradient-btn font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
              >
                Contact Support
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
