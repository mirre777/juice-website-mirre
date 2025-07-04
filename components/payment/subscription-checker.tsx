"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface SubscriptionStatus {
  isPremium: boolean
  plan?: string
  expiresAt?: string
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({ isPremium: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true)

        // For now, check localStorage (this will be replaced with Firebase later)
        const storedData = localStorage.getItem("juice_user_subscription")

        if (storedData) {
          const subscriptionData = JSON.parse(storedData)
          setStatus({
            isPremium: true,
            plan: subscriptionData.plan,
            expiresAt: subscriptionData.nextBillingDate,
          })
        } else {
          // When Firebase is connected, you would check the user's subscription status
          // const userDoc = await db.collection('users').doc(userId).get()
          // const userData = userDoc.data()
          // setStatus({
          //   isPremium: userData?.isPremium || false,
          //   plan: userData?.subscriptionPlan,
          //   expiresAt: userData?.subscriptionExpiresAt
          // })

          setStatus({ isPremium: false })
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
        setStatus({ isPremium: false })
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  return { status, loading }
}

interface ProtectedContentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedContent({ children, fallback }: ProtectedContentProps) {
  const { status, loading } = useSubscription()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-juice border-r-transparent"></div>
        <span className="ml-2">Checking subscription...</span>
      </div>
    )
  }

  if (!status.isPremium) {
    return (
      fallback || (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="mb-2 text-lg font-medium text-red-800">Premium Content</h3>
          <p className="text-red-700">This content is only available to premium subscribers.</p>
          <button
            onClick={() => (window.location.href = "/payment")}
            className="mt-4 rounded-md bg-juice px-4 py-2 text-sm font-medium text-black hover:bg-juice/90"
          >
            Upgrade Now
          </button>
        </div>
      )
    )
  }

  return <>{children}</>
}

export function SubscriptionBadge() {
  const { status, loading } = useSubscription()

  if (loading || !status.isPremium) return null

  return (
    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      {status.plan || "Premium"} Member
    </div>
  )
}
