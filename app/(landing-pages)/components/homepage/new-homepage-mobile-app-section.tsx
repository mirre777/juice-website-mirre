"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ClipboardList, Video, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface MobileAppSectionProps {
  features: Feature[]
  phoneImageUrl?: string
}

const iconMap = {
  clipboard: ClipboardList,
  video: Video,
  sparkles: Sparkles,
}

export function MobileAppSection({ features, phoneImageUrl }: MobileAppSectionProps) {
  const [hasTriggered, setHasTriggered] = useState(false)

  const triggerConfetti = () => {
    if (hasTriggered) return // Only trigger once per hover
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
    window.location.href = "/download-juice-app"
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
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 justify-center font-inter"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=fitness.beta.juice&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 justify-center font-inter"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Get it on Android
                </a>
              </div>
            </div>

            {/* Phone Visual */}
            {phoneImageUrl && (
              <div className="flex-1 flex justify-center">
                <div
                  className="relative w-64 h-auto transform -rotate-3 cursor-pointer transition-transform hover:scale-105"
                  onMouseEnter={triggerConfetti}
                  onMouseLeave={handleMouseLeave}
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

