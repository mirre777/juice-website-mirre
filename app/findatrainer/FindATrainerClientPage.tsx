"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form"
import { TrainerGrid } from "@/components/trainer-grid"

export default function FindATrainerClientPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-juice/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-juice/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="juice-text-gradient">We Need You.</span>
              <br />
              <span className="text-white">To Get Fit.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed">
              We will pair you with a personal trainer that knows what you need. Get early access and pick first.
            </p>
          </motion.div>

          {/* Trainer Grid Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TrainerGrid totalSpots={40} filledSpots={17} />
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            id="waitlist-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <WaitlistForm selectedPlan="first-100" />
          </motion.div>

          {/* What Happens Next Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">What Happens Next</h2>
          </motion.div>

          {/* Additional Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Priority Matching</h3>
              <p className="text-zinc-400 text-sm">Get first access to new personal trainers in your area</p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Verified Coaches</h3>
              <p className="text-zinc-400 text-sm">All trainers are pre-screened and serious about helping you</p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Exclusive Network and Support</h3>
              <p className="text-zinc-400 text-sm">Join a curated community of supportive gym-goers and trainers</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
