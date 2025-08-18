"use client"

import { useState, useEffect } from "react"

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
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow">
        <a
          href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-black hover:text-gray-700 transition-colors"
        >
          <img src="/images/download-app-button.png" alt="Download App" className="w-8 h-8" />
          <span className="font-semibold text-sm hidden sm:block">Download App</span>
        </a>
      </div>
    </div>
  )
}
