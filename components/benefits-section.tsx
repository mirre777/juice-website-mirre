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

  return (
    <div className={`pt-10 pb-0 ${isCoach ? "bg-white" : "bg-black"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>BENEFITS</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            Why trainers choose Juice
          </h2>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} max-w-2xl`}>
            Our platform is designed to make your life easier and your business more successful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start text-left p-4 md:p-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#f7ffd7] flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-black" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isCoach ? "text-black" : "text-white"}`}>Save Time</h3>
            <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Automate client management and workout tracking to focus on what matters most - training.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-start text-left p-4 md:p-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#f7ffd7] flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-black" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isCoach ? "text-black" : "text-white"}`}>Grow Your Business</h3>
            <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Impress clients with professional tools and deliver better results to attract more referrals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-start text-left p-4 md:p-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#f7ffd7] flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isCoach ? "text-black" : "text-white"}`}>Reduce Admin Work</h3>
            <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Eliminate spreadsheets and manual tracking with our all-in-one platform built for trainers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-start text-left p-4 md:p-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#f7ffd7] flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-black" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
              Improve Client Results
            </h3>
            <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
              Track progress more effectively and provide data-driven feedback to help clients succeed.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
