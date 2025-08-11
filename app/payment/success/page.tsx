"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"activating" | "activated" | "error">("activating")
  const [message, setMessage] = useState<string>("Activating your profile...")

  useEffect(() => {
    async function run() {
      const payment_intent = params.get("payment_intent")
      const session_id = params.get("session_id")

      try {
        // Prefer session_id for Checkout; fallback to payment_intent for Payment Element.
        const res = await fetch("/api/trainer/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(session_id ? { sessionId: session_id } : {}),
            ...(payment_intent ? { paymentIntentId: payment_intent } : {}),
          }),
        })

        const data = await res.json().catch(() => ({}) as any)
        if (!res.ok || !data?.success) {
          setStatus("error")
          setMessage(data?.error || "Activation failed. Please contact support.")
          return
        }

        // Save references to assist the temp page fallback flow
        if (payment_intent) localStorage.setItem("lastPaymentIntentId", payment_intent)
        if (session_id) localStorage.setItem("lastStripeSessionId", session_id)
        if (data?.trainerId) localStorage.setItem("lastActivatedTrainerId", data.trainerId)

        setStatus("activated")
        setMessage("Your profile is active! Redirecting...")
        setTimeout(() => {
          const trainerId = data?.trainerId || ""
          if (trainerId) {
            router.replace(`/marketplace/trainer/${trainerId}`)
          } else {
            router.replace("/marketplace")
          }
        }, 1200)
      } catch (e: any) {
        setStatus("error")
        setMessage(e?.message || "Activation failed. Please try again.")
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          {status === "activating" && (
            <>
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-gray-700" />
              <h2 className="text-xl font-semibold mb-2">Finalizing your activation</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          {status === "activated" && (
            <>
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-600" />
              <h2 className="text-xl font-semibold mb-2">All set!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          {status === "error" && (
            <>
              <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-red-600" />
              <h2 className="text-xl font-semibold mb-2">Activation error</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => location.reload()}>Retry</Button>
                <Button variant="outline" onClick={() => router.push("/marketplace")}>
                  Go to Marketplace
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
