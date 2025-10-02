"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form"

export default function GetClientsClientPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-juice">Get more clients.</h1>

          <p className="text-xl md:text-2xl text-zinc-300 mb-16 max-w-3xl mx-auto">
            A curated network for elite trainers. Gain access to a growing community of clients seeking your expertise.
            Be among the first to join.
          </p>

          <div className="max-w-2xl mx-auto">
            <WaitlistForm selectedPlan="trainer-marketplace" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Clients and Grow Your Training Business</h2>
        </div>
      </section>

      <Footer />
    </div>
  )
}
