"use client"

import { useState, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { WaitlistForm } from "@/components/waitlist-form"

export function CTASection() {
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
    <section className={`py-20 ${isCoach ? "bg-gray-50" : "bg-zinc-800"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="mb-4">
            Ready to Start?
          </Badge>
          <h2 className={`text-4xl md:text-5xl font-bold ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Transform your coaching business today" : "Start your fitness transformation today"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Join thousands of successful coaches who have grown their business with Juice. Start your free trial today."
              : "Take the first step towards your fitness goals. Connect with expert coaches and start seeing results."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  : "border-zinc-600 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              Learn More
            </Button>
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
