"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TrainerPricingSection } from "@/components/trainer-pricing-section"
import { useTheme } from "@/components/theme-provider"

export default function PricingPage() {
  const { setIsCoach } = useTheme()

  // Set to trainer mode
  useEffect(() => {
    setIsCoach(true)
  }, [setIsCoach])

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <TrainerPricingSection />
      </div>

      <Footer />
    </main>
  )
}

