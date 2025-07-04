"use client"
import { motion } from "framer-motion"
import type React from "react"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserToggle } from "./user-toggle"
import { useTheme } from "@/components/theme-provider"
import { scrollToSection } from "@/lib/utils"
import Link from "next/link"

export function CTASection() {
  const { isCoach, setIsCoach } = useTheme()

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection("how-it-works")
  }

  const handlePlanClick = (plan: string) => {
    // Placeholder function for handling plan clicks
    console.log(`Plan clicked: ${plan}`)
  }

  return (
    <section id="cta" className="pt-10 pb-0">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 md:p-12"
        >
          {/* Background elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-juice/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-juice/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Join Juice today at absolutely no cost and revolutionize how you manage clients, track progress, and
              deliver exceptional results.
            </h2>

            {/* "at no cost" callout */}
            <div className="absolute top-0 right-1/2 transform translate-x-20 -translate-y-1/4 md:translate-x-32 md:-translate-y-1/2 bg-blue-200 p-3 text-sm rotate-6">
              <p className="font-medium">"at no cost"</p>
              <p className="text-xs text-right mt-2">Laner</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 mt-4">
              <UserToggle isCoach={isCoach} onChange={setIsCoach} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="https://v0-coachingplatform.vercel.app/signup" passHref>
                <button
                  className={`rounded-full px-6 py-3 font-medium flex items-center ${
                    isCoach ? "trainer-gradient-btn" : "client-gradient-btn"
                  } transition-colors`}
                  id={isCoach ? "CTA_Click_Create_Trainer_Bottom" : "CTA_Click_Start_Client_Bottom"}
                >
                  {isCoach ? "Create Dashboard - It's Free" : "Start Tracking"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 text-lg px-8 text-black"
                onClick={handleHowItWorksClick}
                id={isCoach ? "CTA_Click_SeeWorks_Trainer_Bottom" : "CTA_Click_SeeWorks_Client_Bottom"}
              >
                See How It Works
              </Button>
            </div>
            <Button
              className={`w-full max-w-xs mx-auto sm:max-w-none ${
                isCoach ? "trainer-gradient-btn" : "client-gradient-btn"
              } text-black mt-4`}
              id={isCoach ? "early_access_trainer_cta" : "early_access_client_cta"}
              onClick={() => handlePlanClick("coach")}
            >
              Get early access
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
