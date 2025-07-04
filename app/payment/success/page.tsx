"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { useTheme } from "@/components/theme-provider"

// API URL for your separate API project
const API_URL = "https://juice-api.vercel.app" // Replace with your actual API URL

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const { isCoach } = useTheme()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [planName, setPlanName] = useState("Premium")

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment_intent from URL or localStorage
        const paymentIntentId = searchParams.get("payment_intent") || localStorage.getItem("juice_payment_reference")

        if (!paymentIntentId) {
          console.error("No payment reference found")
          setVerificationStatus("error")
          return
        }

        // Call your verification API - updated to use the new API URL
        const response = await fetch(`${API_URL}/api/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setVerificationStatus("success")
          // If the API returns plan info, use it
          if (data.plan) {
            setPlanName(data.plan)
          }

          // Store subscription data in localStorage before redirecting
          const subscriptionData = {
            id: paymentIntentId,
            status: "active",
            plan: data.plan || "premium",
            planType: data.planType || "Premium Subscription",
            paymentDate: new Date().toISOString(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isPremium: true,
          }

          localStorage.setItem("juice_user_subscription", JSON.stringify(subscriptionData))
        } else {
          console.error("Payment verification failed:", data.message)
          setVerificationStatus("error")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setVerificationStatus("error")
      }
    }

    verifyPayment()
  }, [searchParams])

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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
        </div>
      </div>
    )
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className={`mt-4 text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
            Payment Verification Failed
          </h2>
          <p className={`mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            We couldn't verify your payment. Please contact our support team for assistance.
          </p>
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-juice hover:bg-juice/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-juice"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <PaymentSuccess planName={planName} />
}
