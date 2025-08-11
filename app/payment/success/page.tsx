"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type Status = "initial" | "verifying" | "activating" | "success" | "error"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState<Status>("initial")
  const [message, setMessage] = useState<string>("")
  const [trainerId, setTrainerId] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setStatus("verifying")

      // payment_intent from Stripe redirect; fallback to local storage
      const paymentIntentId =
        searchParams.get("payment_intent") ||
        localStorage.getItem("juice_payment_reference") ||
        ""

      if (!paymentIntentId) {
        setStatus("error")
        setMessage("No payment reference found.")
        return
      }

      try {
        // Activate on the backend (idempotent). This verifies payment server-side.
        setStatus("activating")
        const res = await fetch("/api/trainer/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        })
        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Activation failed")
        }

        const id = data.trainerId as string
        setTrainerId(id)
        setStatus("success")
        setMessage("Your trainer profile has been activated successfully.")

        // Cleanup local reference (if any)
        localStorage.removeItem("juice_payment_reference")

        // Redirect to the live trainer page after a short delay
        setTimeout(() => {
          router.replace(`/marketplace/trainer/${id}`)
        }, 1200)
      } catch (e: any) {
        console.error("Payment success page error:", e?.message || e)
        setStatus("error")
        setMessage(e?.message || "We couldn't activate your profile. Please try again.")
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border p-6">
        {status === "verifying" || status === "activating" ? (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <h1 className="text-xl font-semibold text-center">
              {status === "verifying" ? "Verifying your payment..." : "Activating your profile..."}
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              This only takes a few seconds. Please don&apos;t close this page.
            </p>
          </>
        ) : status === "success" ? (
          <>
            <h1 className="text-xl font-semibold text-center">Success!</h1>
            <p className="mt-2 text-center text-muted-foreground">{message}</p>
            {trainerId && (
              <div className="mt-6 flex justify-center">
                <Button onClick={() => router.replace(`/marketplace/trainer/${trainerId}`)}>
                  View Your Live Page
                </Button>
              </div>
            )}
          </>
        ) : status === "error" ? (
          <>
            <h1 className="text-xl font-semibold text-center text-red-600">Activation Problem</h1>
            <p className="mt-2 text-center text-muted-foreground">{message}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" onClick={() => router.replace("/marketplace/personal-trainer-website")}>
                Back to Start
              </Button>
              <Button onClick={() => router.refresh()}>Try Again</Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-center">Finalizing...</h1>
            <p className="mt-2 text-center text-muted-foreground">Preparing your confirmation.</p>
          </>
        )}
      </div>
    </main>
  )
}
