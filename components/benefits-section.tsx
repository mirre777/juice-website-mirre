"use client"

import { motion } from "framer-motion"
import { Check, Shield, Clock, Award } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function BenefitsSection() {
  const { isCoach } = useTheme()

  // If not in coach view, don't render anything
  if (!isCoach) {
    return null
  }

  const benefits = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Save Time",
      description: "Automate client management and workout tracking to focus on what matters most - training.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Grow Your Business",
      description: "Impress clients with professional tools and deliver better results to attract more referrals.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Reduce Admin Work",
      description: "Eliminate spreadsheets and manual tracking with our all-in-one platform built for trainers.",
    },
    {
      icon: <Check className="h-8 w-8" />,
      title: "Improve Client Results",
      description: "Track progress more effectively and provide data-driven feedback to help clients succeed.",
    },
  ]

  return (
    <section id="benefits" className={`pt-20 pb-20 ${isCoach ? "bg-white" : "bg-black"} maintain-scroll`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>HOW IT WORKS</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            Getting Started
          </h2>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} max-w-2xl`}>
            Don't stress. We'll hold your hand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-start text-left p-4 md:p-6"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-juice/10 mb-4">
                <div className="text-juice">{benefit.icon}</div>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>{benefit.title}</h3>
              <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
