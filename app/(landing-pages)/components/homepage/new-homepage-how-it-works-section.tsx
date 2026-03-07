"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
}

interface NewHowItWorksSectionProps {
  steps: Step[]
  onDemoClick?: () => void
  onTryItClick?: () => void
}

export function NewHowItWorksSection({ steps, onDemoClick, onTryItClick }: NewHowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white">
      {/* Green bar at top */}
      <div className="h-2 bg-juice w-full"></div>
      <div className="pt-8 md:pt-12 pb-8 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-[36px] font-semibold text-center mb-4 font-inter">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-12 font-inter">
            Get found, deliver your program, and track progress → in three steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-juice flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-black font-sen">{step.number}</span>
                </div>
                <h3 className="text-[20px] font-semibold mb-2 font-inter whitespace-nowrap">{step.title}</h3>
                <p className="text-gray-600 font-inter">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-2">
            {onDemoClick && (
              <button
                onClick={onDemoClick}
                className="bg-white border-2 border-black text-black px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 font-inter"
              >
                <Play className="w-4 h-4" />
                Demo
              </button>
            )}
            {onTryItClick && (
              <button
                onClick={onTryItClick}
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity font-inter"
              >
                Try it out. It's FREE!
              </button>
            )}
          </div>

          {/* Note */}
          <p className="text-sm text-gray-500 text-center font-inter mb-0">No credit card required. Get started in minutes.</p>
        </div>
      </div>
    </section>
  )
}

