"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

interface PaymentSuccessProps {
  planName?: string
}

export function PaymentSuccess({ planName = "Premium" }: PaymentSuccessProps) {
  const { isCoach } = useTheme()

  return (
    <div className="py-8 text-center">
      <div
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isCoach ? "bg-green-100" : "bg-green-900/30"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className={`mt-6 text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>Payment Successful!</h3>
      <p className={`mt-2 ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
        Thank you for subscribing to Juice {planName}
      </p>

      <div className="mt-6 space-y-4">
        <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
          Your subscription is now active. You can now access all premium features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => (window.location.href = "https://app.juice.fitness")}
            className="trainer-gradient-btn"
          >
            Go to App
          </Button>

          <Button asChild variant="outline" className={isCoach ? "" : "border-zinc-700"}>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
