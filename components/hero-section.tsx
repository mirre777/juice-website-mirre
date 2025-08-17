"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, FileText, ThumbsUp } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { scrollToSection } from "@/lib/utils"
import { CoachDashboard } from "./coach-dashboard"

export function HeroSection() {
  const { isCoach } = useTheme()

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection("how-it-works")
  }

  return (
    <section className={`relative w-full py-12 md:py-24 lg:py-32 xl:py-48 ${isCoach ? "bg-white" : "bg-black"}`}>
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${isCoach ? "bg-juice/5" : "bg-juice/10"} blur-3xl`}
        />
        <div
          className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full ${isCoach ? "bg-juice/5" : "bg-juice/10"} blur-3xl`}
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center max-w-4xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-center juice-text-gradient">
              {isCoach ? "Kill the Spreadsheet." : "Unlock Your Potential."}
              <br />
              {isCoach ? "Keep the Sweat." : "Connect with Clients."}
            </h1>
            <p className={cn("mx-auto max-w-[700px] text-lg md:text-xl", isCoach ? "text-gray-600" : "text-white")}>
              {isCoach
                ? "Juice is the ultimate platform for fitness coaches to manage clients, create workouts, and grow their business."
                : "Simplify Training."}
            </p>
          </div>
          <div className="space-x-4">
            {isCoach ? (
              <Button className="trainer-gradient-btn" asChild>
                <Link href="https://app.juice.fitness/">Start now</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-juice text-juice-foreground hover:bg-juice/90 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto"
                id="CTA_Click_Start_Client_FirstView"
              >
                Download App
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>

          {isCoach ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 mt-12 max-w-3xl"
            >
              <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:gap-8 justify-center">
                <div className="flex flex-row items-center gap-3 md:gap-4 bg-[#f7ffd7]/20 p-3 md:p-4 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f7ffd7] flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-black" />
                  </div>
                  <p className="text-zinc-600 font-medium text-left">See client progress and PRs all in one place</p>
                </div>

                <div className="flex flex-row items-center gap-3 md:gap-4 bg-[#f7ffd7]/20 p-3 md:p-4 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f7ffd7] flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-black" />
                  </div>
                  <p className="text-zinc-600 font-medium text-left">Import your own workout programs</p>
                </div>

                <div className="flex flex-row items-center gap-3 md:gap-4 bg-[#f7ffd7]/20 p-3 md:p-4 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f7ffd7] flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="h-6 w-6 text-black" />
                  </div>
                  <p className="text-zinc-600 font-medium text-left">Share workouts and one-click encouragements</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 max-w-2xl"
            >
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-juice text-black font-bold mt-1">
                    1
                  </div>
                  <p className="text-xl text-zinc-400">Track your workout through our simple app</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-juice text-black font-bold mt-1">
                    2
                  </div>
                  <p className="text-xl text-zinc-400">Share with a trainer</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-juice text-black font-bold mt-1">
                    3
                  </div>
                  <p className="text-xl text-zinc-400">Get gains faster</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-2 w-full sm:w-auto mx-auto"
          >
            <Link href="https://v0-coachingplatform.vercel.app/signup" passHref>
              <Button
                size="lg"
                className="bg-juice text-juice-foreground hover:bg-juice/90 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto"
                id={isCoach ? "CTA_Click_Create_Coach_FirstView" : "CTA_Click_Start_Client_FirstView"}
              >
                {isCoach ? "Create Dashboard" : "Start Tracking"}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-base sm:text-lg px-4 sm:px-8 w-full sm:w-auto bg-transparent"
              onClick={handleHowItWorksClick}
              id={isCoach ? "CTA_Click_SeeWorks_Coach_FirstView" : "CTA_Click_SeeWorks_Client_FirstView"}
            >
              See How It Works
            </Button>
          </motion.div>

          {!isCoach && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="w-full mt-8 flex flex-col items-center"
            >
              <div className="w-full max-w-xs">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grouped2.png-5fgujVXCN7IjtalAMRb3UbRpx7bgEC.jpeg"
                  alt="Juice App Interface"
                  width={320}
                  height={256}
                  className="w-auto h-auto mx-auto"
                  priority
                />
              </div>
            </motion.div>
          )}

          {isCoach && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative w-full max-w-5xl mt-12"
            >
              <div className="relative flex justify-center">
                <div className="relative z-10 mx-auto">
                  <CoachDashboard />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
