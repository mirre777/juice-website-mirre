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
      <section className="pt-32 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isCoach ? "text-black" : "text-white"}`}>
              Pricing with Payment Integration
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mb-8">
              This page demonstrates the pricing section with integrated QR code payment
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section with Payment */}
      <PricingSectionWithPayment />

      <Footer />
    </main>
  )
}
