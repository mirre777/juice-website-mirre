"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: { tempId: string }
}

export default function TempTrainerPage({ params }: PageProps) {
  const { tempId } = params
  const router = useRouter()
  const [state, setState] = useState<
    { status: "loading" } | { status: "error"; message: string } | { status: "ready"; trainer: any; verifying: boolean }
  >({ status: "loading" })

  const paymentIntentId = useMemo(() => localStorage.getItem("lastPaymentIntentId") || "", [])
  const sessionId = useMemo(() => localStorage.getItem("lastStripeSessionId") || "", [])

  useEffect(() => {
    let cancelled = false

    async function fetchTrainer() {
      try {
        const res = await fetch(`/api/trainer/temp/${tempId}`)
        if (res.status === 410) {
          setState({ status: "error", message: "Preview expired. Please create a new profile." })
          return
        }
        const data = await res.json().catch(() => ({}) as any)
        if (!res.ok || !data?.success || !data?.trainer) {
          setState({ status: "error", message: data?.error || "Failed to load preview." })
          return
        }
        if (!cancelled) setState({ status: "ready", trainer: data.trainer, verifying: false })
      } catch (e: any) {
        if (!cancelled) setState({ status: "error", message: e?.message || "Failed to load preview." })
      }
    }

    fetchTrainer()
    return () => {
      cancelled = true
    }
  }, [tempId])

  // After load, if we have recent payment reference, verify/activate as a fallback.
  useEffect(() => {
    async function verifyAndActivate() {
      if (state.status !== "ready") return
      if (!paymentIntentId && !sessionId) return
      if (state.trainer?.status === "active" || state.trainer?.isPaid === true) return

      setState((s) => (s.status === "ready" ? { ...s, verifying: true } : s))

      try {
        // Verify first
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(sessionId ? { sessionId } : {}),
            ...(paymentIntentId ? { paymentIntentId } : {}),
          }),
        })
        const verify = await verifyRes.json().catch(() => ({}) as any)
        if (verify?.success !== true) {
          setState((s) => (s.status === "ready" ? { ...s, verifying: false } : s))
          return
        }

        // Activate (idempotent)
        const actRes = await fetch("/api/trainer/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(sessionId ? { sessionId } : {}),
            ...(paymentIntentId ? { paymentIntentId } : {}),
          }),
        })
        const act = await actRes.json().catch(() => ({}) as any)
        if (act?.success) {
          const id = act?.trainerId || tempId
          router.replace(`/marketplace/trainer/${id}`)
        } else {
          setState((s) => (s.status === "ready" ? { ...s, verifying: false } : s))
        }
      } catch (_err) {
        setState((s) => (s.status === "ready" ? { ...s, verifying: false } : s))
      }
    }

    verifyAndActivate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  if (state.status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Preview Not Available</h2>
            <p className="text-gray-600 mb-4">{state.message}</p>
            <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Minimal preview shell while verifying (we avoid heavy UI here)
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="pt-8 text-center space-y-2">
          <h2 className="text-2xl font-semibold">Preview Mode</h2>
          <p className="text-gray-600">Trainer: {state.trainer?.fullName || state.trainer?.name || tempId}</p>
          {state.verifying ? (
            <div className="mt-3 inline-flex items-center gap-2 text-gray-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying recent payment...</span>
            </div>
          ) : (
            <div className="text-gray-500">Expires at: {state.trainer?.expiresAt || "N/A"}</div>
          )}
          <div className="pt-4">
            <Button variant="outline" onClick={() => router.push(`/marketplace/trainer/${tempId}`)}>
              View Live
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
