"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form"
import { Button } from "@/components/ui/button"
import { Check, Users, TrendingUp, Shield, Zap, Target } from "lucide-react"

export default function GetClientsClientPage() {
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
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="juice-text-gradient">Get More Clients.</span>
              <br />
              <span className="text-white">Grow Your Business.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed">
              Join Juice's curated marketplace for elite personal trainers. Get qualified leads, streamlined client
              acquisition, and grow your fitness business with our proven 3-step process.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <Button
              size="lg"
              className="bg-juice hover:bg-juice/90 text-black font-semibold px-8 py-6 text-lg"
              onClick={() => {
                document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Join the Marketplace
            </Button>
          </motion.div>

          {/* 3-Step Process */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-8 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="w-16 h-16 bg-juice rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Create Your Profile</h3>
                <p className="text-zinc-400">
                  Showcase your expertise, certifications, and training style to attract your ideal clients
                </p>
              </div>

              <div className="text-center p-8 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="w-16 h-16 bg-juice rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Get Matched</h3>
                <p className="text-zinc-400">
                  Our algorithm connects you with qualified clients actively looking for trainers in your area
                </p>
              </div>

              <div className="text-center p-8 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="w-16 h-16 bg-juice rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Grow Your Business</h3>
                <p className="text-zinc-400">
                  Convert leads into long-term clients and scale your personal training business
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">Why Join Juice?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Qualified Leads Only</h3>
                  <p className="text-zinc-400 text-sm">
                    All clients are pre-screened and serious about their fitness goals. No time wasters.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Grow Your Revenue</h3>
                  <p className="text-zinc-400 text-sm">
                    Increase your client base and revenue with a steady stream of qualified leads.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Curated Network</h3>
                  <p className="text-zinc-400 text-sm">
                    Join an exclusive community of elite trainers. We only accept the best.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Fast & Easy Setup</h3>
                  <p className="text-zinc-400 text-sm">
                    Get your profile live in minutes. Start receiving client inquiries immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Smart Matching</h3>
                  <p className="text-zinc-400 text-sm">
                    Our algorithm matches you with clients who fit your training style and expertise.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-black/20 rounded-xl backdrop-blur-sm border border-zinc-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-juice/10 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-juice" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">No Commission Fees</h3>
                  <p className="text-zinc-400 text-sm">
                    Keep 100% of what you earn. We don't take a cut of your training sessions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            id="waitlist-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Get More Clients?</h2>
            <p className="text-zinc-400 mb-8">Join the waitlist and be among the first trainers on our platform.</p>
            <WaitlistForm selectedPlan="trainer-marketplace-interest" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
