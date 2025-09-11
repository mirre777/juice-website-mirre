"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { needsConsentBanner, setAnalyticsConsent } from "@/lib/analytics"

export function AnalyticsConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if we need to show the consent banner
    setShowBanner(needsConsentBanner())
  }, [])

  const handleAccept = () => {
    setAnalyticsConsent(true)
    setShowBanner(false)
  }

  const handleDecline = () => {
    setAnalyticsConsent(false)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-sm">Cookie Preferences</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDecline}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          We use analytics cookies to improve your experience and understand how our site is used. This helps us provide
          better service to you and other users.
        </p>

        <div className="flex gap-2">
          <Button onClick={handleAccept} size="sm" className="flex-1 text-xs">
            Accept
          </Button>
          <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
            Decline
          </Button>
        </div>
      </Card>
    </div>
  )
}
