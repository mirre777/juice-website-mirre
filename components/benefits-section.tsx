"use client"

import { motion } from "framer-motion"
import { UserPlus, Send, Eye, Smartphone, ArrowRight } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function BenefitsSection() {
  const { isCoach } = useTheme()

  // If not in coach view, don't render anything
  if (!isCoach) {
    return null
  }

  const benefits = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Sign up for the web app",
      description: "Get started in minutes with our intuitive platform designed specifically for personal trainers.",
    },
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Invite your client",
      description: "Easily onboard clients to the platform with simple invitation links and seamless setup.",
    },
    {
      icon: <Send className="h-8 w-8" />,
      title: "Convert and send them a program",
      description: "Transform your existing workout plans into digital programs and deliver them instantly to clients.",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "See their workout results instantly",
      description: "Monitor client progress in real-time and get immediate feedback on their workout performance.",
    },
  ]

  return (
    <section id="how-it-works" className={`pt-20 pb-20 ${isCoach ? "bg-white" : "bg-black"} maintain-scroll`}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            viewBox="0 0 1000 200"
            fill="none"
          >
            <path
              d="M 120 32 Q 300 -12 400 32 Q 500 76 600 32 Q 700 -12 880 32"
              stroke="#c4f82a"
              strokeWidth="4"
              strokeDasharray="12,6"
              fill="none"
              opacity="0.8"
            />
          </svg>

          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-start text-left p-4 md:p-6 relative z-10"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-juice mb-4">
                <div className="text-black font-bold text-2xl">{index + 1}</div>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>{benefit.title}</h3>
              <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-juice hover:bg-juice/90 text-black font-semibold px-8 py-3 text-lg"
              onClick={() => (window.location.href = "https://app.juice.fitness/")}
            >
              Go to web app
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
