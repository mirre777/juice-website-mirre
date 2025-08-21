"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PricingSectionWithPayment } from "@/components/pricing-section-with-payment"
import { useTheme } from "@/components/theme-provider"

export default function PricingDemoPageClient() {
  const { isCoach } = useTheme()

  return (
    <main className={`min-h-screen ${isCoach ? "bg-white" : "bg-black"} text-white`}>
      <Navbar />

      {/* Hero Section */}
      

      {/* Pricing Section with Payment */}
      <PricingSectionWithPayment />

      <Footer />
    </main>
  )
}
