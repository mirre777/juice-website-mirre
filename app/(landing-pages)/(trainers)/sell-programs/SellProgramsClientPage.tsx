"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LinkButton } from "@/components/link-button"

export default function SellProgramsClientPage() {
  // Replace this with your actual Typeform URL
  const typeformUrl = "https://your-typeform-url.typeform.com/to/your-form-id"

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
              <span className="juice-text-gradient">Sell Your</span>
              <br />
              <span className="juice-text-gradient">Workout Programs</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed">
              Turn your expertise into income. Join Juice's marketplace and reach thousands of clients looking for
              professional workout programs.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            id="signup-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <LinkButton
              href={typeformUrl}
              external={true}
              variant="juice"
              size="lg"
              className="text-xl px-8 py-6 h-auto font-semibold"
            >
              Sign Up to Sell Your Programs
            </LinkButton>
            <p className="text-zinc-500 text-sm mt-4">Join our marketplace and start earning today</p>
          </motion.div>

          {/* What Happens Next Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">Why sell on Juice?</h2>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Earn Passive Income</h3>
              <p className="text-zinc-400 text-sm">
                Set your prices and earn money every time someone purchases your program
              </p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Reach More Clients</h3>
              <p className="text-zinc-400 text-sm">
                Access our growing community of fitness enthusiasts actively looking for programs
              </p>
            </div>

            <div className="text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Easy Setup</h3>
              <p className="text-zinc-400 text-sm">
                Upload your programs quickly and start selling within minutes
              </p>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Sign Up</h3>
                <p className="text-zinc-400 text-sm">Complete our quick application form to get started</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Upload Programs</h3>
                <p className="text-zinc-400 text-sm">Add your workout programs with descriptions and pricing</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-juice rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Start Earning</h3>
                <p className="text-zinc-400 text-sm">Clients discover and purchase your programs automatically</p>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20"
          >
            <LinkButton
              href={typeformUrl}
              external={true}
              variant="juice"
              size="lg"
              className="text-xl px-8 py-6 h-auto font-semibold"
            >
              Get Started Now
            </LinkButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}







