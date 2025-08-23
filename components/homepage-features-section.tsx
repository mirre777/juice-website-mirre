"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Activity, BarChart3, Calendar, Dumbbell, MessageSquare, Share2, Smartphone, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
}

export function HomePageFeaturesSection() {
  const { isCoach, setIsCoach } = useTheme()
  const router = useRouter()

  const clientFeatures: Feature[] = [
    {
      icon: <Activity className="h-6 w-6 text-juice" />,
      title: "Track your progress",
      description:
        "Monitor your fitness journey with detailed metrics and visualizations that show your improvement over time.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-juice" />,
      title: "Workout schedule",
      description:
        "Access your personalized workout plans and schedule anytime, anywhere with clear instructions for each exercise.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-juice" />,
      title: "Direct communication",
      description: "Chat directly with your trainer for guidance, feedback, and motivation between sessions.",
    },
    {
      icon: <Share2 className="h-6 w-6 text-juice" />,
      title: "Share achievements",
      description: "Celebrate your wins by sharing your progress and achievements with your trainer and community.",
    },
  ]

  const trainerFeatures: Feature[] = [
    {
      icon: <Users className="h-6 w-6 text-juice" />,
      title: "Client management",
      description: "All your clients' details, goals, and progress in one fitness coaching app.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-juice" />,
      title: "Instant performance insights",
      description: "Know exactly how your clients are doing, spot plateaus fast, and celebrate every milestone.",
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-juice" />,
      title: "Workout builder app",
      description: "Create customized workouts, import from Google Sheets, and update plans seamlessly.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-juice" />,
      title: "Easy workout logging for clients",
      description: "Simpler than other training apps. Stay connected to clients anywhere, anytime, without the hassle.",
    },
  ]

  const trainerBenefits: Benefit[] = [
    {
      icon: <Dumbbell className="h-8 w-8" />,
      title: "Workout builder app",
      description: "Create customized workouts, import from Google Sheets, and update plans seamlessly.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Client management",
      description: "All your clients' details, goals, and progress in one fitness coaching app.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Easy workout logging for clients",
      description: "Simpler than other training apps. Stay connected to clients anywhere, anytime, without the hassle.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Instant performance insights",
      description: "Know exactly how your clients are doing, spot plateaus fast, and celebrate every milestone.",
    },
  ]

  return (
    <div className={`pt-8 pb-0 ${isCoach ? "bg-white" : "bg-black"} maintain-scroll`}>
      <div className="container px-4 md:px-6 pb-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>WEBPAGE BUILDER</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            Your Own Page To Get Client Bookings
          </h2>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} max-w-2xl`}>
            We have a standard layout but you can add your services, a booking button and even a link to an already
            existing website.
          </p>
        </div>

        <Tabs
          defaultValue="client"
          value={isCoach ? "trainer" : "client"}
          onValueChange={(value) => {
            if (value === "trainer") {
              router.push("/#features")
            } else {
              router.push("/clients#features")
            }
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <TabsList className={`grid grid-cols-2 ${isCoach ? "bg-gray-100" : "bg-zinc-800"}`}>
              <TabsTrigger
                value="client"
                className="data-[state=active]:bg-juice data-[state=active]:text-black"
                id="Tab_Client_Features"
              >
                For Clients
              </TabsTrigger>
              <TabsTrigger
                value="trainer"
                className="data-[state=active]:bg-juice data-[state=active]:text-black"
                id="Tab_Trainer_Features"
              >
                For Trainers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="client" className="mt-0 pb-0 min-h-[400px] -mb-16">
            <div id="client-features" className="grid grid-cols-1 gap-4 md:gap-6">
              {clientFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="feature-card">
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="mr-4 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
                          {feature.title}
                        </h3>
                        <p className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trainer" className="mt-0 pb-0 min-h-[400px] -mb-16">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Left side - Webpage Builder Image */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                  <Image
                    src="/images/homepage/microsite-alex.png"
                    alt="Personal trainer website builder"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Right side - Trainer Benefits Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {trainerBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-juice/10 flex items-center justify-center mx-auto mb-4">
                        <div className="text-juice">{benefit.icon}</div>
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${isCoach ? "text-black" : "text-white"}`}>
                        {benefit.title}
                      </h3>
                      <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>{benefit.description}</p>
                      {/* Add arrow between benefits except for the last one */}
                      {index < trainerBenefits.length - 1 && index % 2 === 0 && (
                        <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                          <svg className="w-4 h-4 text-juice" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
