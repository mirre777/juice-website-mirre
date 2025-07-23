"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { WaitlistForm } from "@/components/waitlist-form"
import { useTheme } from "@/components/theme-provider"

export function HeroSection() {
  const { isCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")
  const waitlistRef = useRef<HTMLDivElement>(null)

  const handleWaitlistClick = () => {
    setShowWaitlist(true)

    // Wait for state to update and DOM to render before scrolling
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  useEffect(() => {
    if (showWaitlist && waitlistRef.current) {
      waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [showWaitlist])

  return (
    <section className="pt-32 pb-10 md:pt-40 md:pb-10">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="mb-6 max-w-4xl mx-auto text-center">
          {isCoach ? (
            <div className="flex flex-col space-y-2">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">Kill the hassle.</span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight juice-text-gradient pb-4">
                Keep the gains.
              </span>
            </div>
          ) : (
            <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Simplify <span className="text-[#D2FF28]">Training.</span>
            </span>
          )}
        </h1>

        <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mb-10 max-w-3xl mx-auto`}>
          {isCoach ? (
            <>
              Juice helps personal trainers effortlessly track clients, manage workouts, billing, and celebrate every
              PR—all in one easy-to-use platform.
            </>
          ) : (
            <>Super simple workout logging. Get insights into your training. Share your workouts.</>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button
            onClick={() => (window.location.href = "https://app.juice.fitness/")}
            className="rounded-full px-6 py-3 font-medium bg-black text-white transition-colors"
            id={isCoach ? "early_access_trainer_hero" : "early_access_client_hero"}
          >
            Start now
          </button>
          <button
            onClick={handleWaitlistClick}
            className={`rounded-full px-6 py-3 ${isCoach ? "border border-gray-200 hover:bg-gray-50" : "border border-zinc-800 hover:bg-zinc-800"} transition-colors flex items-center justify-center gap-2`}
            id={isCoach ? "get_updates_trainer" : "get_updates_client"}
          >
            Get updates
          </button>
        </div>

        {/* Only show this line for trainer view */}
        {isCoach && (
          <p className="text-sm text-gray-500 mt-2 mb-16">
            No credit card required. No lock-in. Works with Google Sheets.
          </p>
        )}

        {/* Waitlist Form */}
        {showWaitlist && (
          <div ref={waitlistRef} className="max-w-md mx-auto mb-16 animate-fadeIn">
            <div
              className={`${isCoach ? "bg-white" : "bg-zinc-900"} border-2 border-[#D2FF28] rounded-xl overflow-hidden shadow-lg`}
            >
              <div className={`${isCoach ? "bg-gray-100" : "bg-zinc-800"} py-3 px-4`}>
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
                    Get early access. Join the waitlist.
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <WaitlistForm selectedPlan={selectedPlan} />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="relative w-full overflow-hidden">
            {isCoach ? (
              <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-03%20at%2012.39.50-cfIFHS6YKyNnMPuAhh0sXLnLmHeabm.png"
                  alt="Juice Dashboard Interface for Coaches"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <div className="w-full max-w-md mx-auto">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grouped2.png-5fgujVXCN7IjtalAMRb3UbRpx7bgEC.jpeg"
                    alt="Juice App Interface for Clients"
                    width={400}
                    height={320}
                    className="w-auto h-auto"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Moved this line to underneath the dashboard image */}
          {isCoach && (
            <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} mt-6 text-center`}>
              Because trainers should train, not juggle admin.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
