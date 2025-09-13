"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WaitlistForm } from "@/components/waitlist-form"
import { TrainerGrid } from "@/components/trainer-grid"
import { Users, Shield, Network } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { trackPageView } from "@/lib/analytics"

export default function FindATrainerClientPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    trackPageView(window.location.href, "Find A Trainer - Get Matched with Personal Trainers")
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-juice">We Need You.</span>
            <br />
            <span className="text-white">To Get Fit.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto">
            We will pair you with a personal trainer that knows what you need. Get early access and pick first.
          </p>

          {/* Spots Grid */}
          <div className="mb-8">
            <TrainerGrid totalSpots={40} filledSpots={17} />
          </div>

          {/* Waitlist Form */}
          <WaitlistForm selectedPlan={selectedPlan} showClientCounter={false} />
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">What Happens Next</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Priority Matching</h3>
                <p className="text-zinc-400">Get first access to new personal trainers in your area</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Verified Coaches</h3>
                <p className="text-zinc-400">All trainers are pre-screened and serious about helping you</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Network className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Exclusive Network and Support</h3>
                <p className="text-zinc-400">Join a curated community of supportive gym-goers and trainers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
