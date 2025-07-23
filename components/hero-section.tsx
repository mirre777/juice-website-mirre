"use client"

import { useState, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"
import Image from "next/image"

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

  return (
    <section className={`pt-24 pb-16 ${isCoach ? "bg-white" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                {isCoach ? "For Fitness Coaches" : "For Fitness Enthusiasts"}
              </Badge>
              <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${isCoach ? "text-black" : "text-white"}`}>
                {isCoach ? (
                  <>
                    Build your
                    <br />
                    <span className="text-orange-500">coaching empire</span>
                  </>
                ) : (
                  <>
                    Transform your
                    <br />
                    <span className="text-orange-500">fitness journey</span>
                  </>
                )}
              </h1>
              <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-lg`}>
                {isCoach
                  ? "The all-in-one platform to grow your personal training business, manage clients, and create custom workout programs."
                  : "Connect with expert coaches, track your progress, and achieve your fitness goals with personalized workout plans."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleWaitlistClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                {isCoach ? "Start Free Trial" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className={`px-8 py-3 text-lg ${
                  isCoach
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-zinc-600 text-gray-300 hover:bg-zinc-800"
                }`}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className={`text-2xl font-bold ${isCoach ? "text-black" : "text-white"}`}>10K+</div>
                <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {isCoach ? "Active Coaches" : "Happy Users"}
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isCoach ? "text-black" : "text-white"}`}>50K+</div>
                <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {isCoach ? "Clients Trained" : "Workouts Completed"}
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isCoach ? "text-black" : "text-white"}`}>98%</div>
                <div className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/images/grouped-app-screens.png"
                alt="Juice App Screenshots"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl -z-10 transform rotate-3"></div>
          </div>
        </div>

        {/* Waitlist Form */}
        {showWaitlist && (
          <div ref={waitlistRef} className="mt-16">
            <WaitlistForm />
          </div>
        )}
      </div>
    </section>
  )
}
