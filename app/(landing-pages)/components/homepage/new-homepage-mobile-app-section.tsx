"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { DownloadButtons } from "@/components/download-buttons"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface MobileAppSectionProps {
  features: Feature[]
  phoneImageUrl?: string
}

export function MobileAppSection({ features, phoneImageUrl }: MobileAppSectionProps) {
  const [hasTriggered, setHasTriggered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const triggerConfetti = () => {
    if (hasTriggered) return // Only trigger once per hover/tap
    setHasTriggered(true)

    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const handleMouseLeave = () => {
    setHasTriggered(false)
  }

  const handleImageClick = () => {
    // On touch devices, delay redirect to allow confetti to show
    if (isTouchDevice) {
      setTimeout(() => {
        window.location.href = "/download-juice-app"
      }, 500)
    } else {
      // On desktop, redirect immediately (confetti already triggered on hover)
      window.location.href = "/download-juice-app"
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Trigger confetti on touch
    triggerConfetti()
  }

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Content */}
            <div className="flex-1">
              <h2 className="text-[30px] leading-[36px] font-semibold mb-12 font-sen text-black">
                Your program, in your client's pocket.
              </h2>
              <p className="text-base leading-6 text-gray-600 mb-8 font-inter">
                Give clients a premium mobile experience. They see their plan, log workouts in seconds, track PRs and
                progress, and stay connected to you.
              </p>

              {/* Features */}
              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-juice flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base leading-6 mb-1 font-inter text-black">{feature.title}</h3>
                      <p className="text-base leading-6 text-gray-600 font-inter">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Download Buttons */}
              <DownloadButtons />
            </div>

            {/* Phone Visual */}
            {phoneImageUrl && (
              <div className="flex-1 flex justify-center">
                <div
                  className="relative w-64 h-auto transform -rotate-3 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  onMouseEnter={!isTouchDevice ? triggerConfetti : undefined}
                  onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
                  onTouchStart={handleTouchStart}
                  onClick={handleImageClick}
                >
                  <img
                    src={phoneImageUrl}
                    alt="Mobile app interface"
                    className="w-full h-auto"
                    loading="eager"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

