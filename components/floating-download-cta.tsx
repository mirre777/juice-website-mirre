"use client"

import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export function FloatingDownloadCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show the floating CTA after scrolling 500px
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="/download-juice-app"
        className="client-gradient-btn px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg"
        onClick={() =>
          trackEvent("cta_click", {
            button_text: "Download App",
            location: "floating-cta",
          })
        }
      >
        Download App
      </a>
    </div>
  )
}
