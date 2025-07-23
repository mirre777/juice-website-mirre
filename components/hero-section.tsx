"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { WaitlistForm } from "@/components/waitlist-form"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function HeroSection() {
  const { isCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const waitlistRef = useRef<HTMLDivElement>(null)

  const handleWaitlistClick = () => {
    setShowWaitlist(true)
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
    <section className={`pt-32 pb-10 md:pt-40 md:pb-10 ${isCoach ? "bg-white" : "bg-black"}`}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            🚀 New: AI-Powered Workout Plans
          </span>
        </div>

        <h1 className="mb-6 max-w-4xl mx-auto text-center">
          {isCoach ? (
            <div className="flex flex-col space-y-2">
              <span
                className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight ${isCoach ? "text-black" : "text-white"}`}
              >
                Kill the hassle.
              </span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent pb-4">
                Keep the gains.
              </span>
            </div>
          ) : (
            <span
              className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight ${isCoach ? "text-black" : "text-white"}`}
            >
              Transform Your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Fitness Journey
              </span>
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
            <>
              Connect with certified personal trainers, track your progress, and achieve your fitness goals with our
              comprehensive platform.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Button
            onClick={() => window.open("https://app.juice.fitness/", "_blank")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            className={`px-8 py-3 rounded-full text-lg font-medium flex items-center gap-2 ${
              isCoach
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-zinc-600 text-gray-300 hover:bg-zinc-800"
            }`}
          >
            <Play size={20} />
            Watch Demo
          </Button>
        </div>

        {isCoach && (
          <p className="text-sm text-gray-500 mt-2 mb-16">
            No credit card required. No lock-in. Works with Google Sheets.
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-16">
          <div className="text-center">
            <div className={`text-4xl font-bold ${isCoach ? "text-black" : "text-white"}`}>10K+</div>
            <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Active Users</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${isCoach ? "text-black" : "text-white"}`}>500+</div>
            <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Certified Trainers</div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${isCoach ? "text-black" : "text-white"}`}>4.9</div>
            <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>⭐ Rating</div>
          </div>
        </div>

        {/* Waitlist Form */}
        {showWaitlist && (
          <div ref={waitlistRef} className="max-w-md mx-auto mb-16 animate-fadeIn">
            <div
              className={`${
                isCoach ? "bg-white" : "bg-zinc-900"
              } border-2 border-orange-500 rounded-xl overflow-hidden shadow-lg`}
            >
              <div className={`${isCoach ? "bg-gray-100" : "bg-zinc-800"} py-3 px-4`}>
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
                    Get early access. Join the waitlist.
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <WaitlistForm selectedPlan="basic" />
              </div>
            </div>
          </div>
        )}

        {/* Hero Image */}
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
