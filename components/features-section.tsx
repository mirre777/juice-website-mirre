"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Activity, BarChart3, Calendar, Dumbbell, MessageSquare, Share2, Smartphone, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { useRouter, usePathname } from "next/navigation"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeaturesSection() {
  const { isCoach, setIsCoach } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const isTrainerPage = pathname === "/"
  const isClientPage = pathname === "/clients"
  const isPersonalTrainerAppPage = pathname === "/personal-trainer-app" || pathname === "/workout-program-app"

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

  const getPageSpecificContent = () => {
    if (isTrainerPage) {
      return {
        smallHeader: "FEATURES",
        header: "Powerful tools for personal trainers",
        description:
          "Everything you need to manage clients, track progress, and grow your fitness business with the best personal training software.",
      }
    } else if (isClientPage) {
      return {
        smallHeader: "FEATURES",
        header: "Powerful tools for fitness enthusiasts",
        description:
          "Achieve your fitness goals faster with personalized workouts, progress tracking, and direct trainer communication.",
      }
    } else if (isPersonalTrainerAppPage) {
      return {
        smallHeader: "FEATURES",
        header: "Powerful tools for personal trainers",
        description:
          "Everything you need to manage clients, track progress, and grow your fitness business with the best personal training software.",
      }
    } else {
      // Fallback for other pages with toggles
      return {
        smallHeader: "FEATURES",
        header: "Powerful tools for both sides of fitness",
        description:
          "Whether you're a client looking to achieve your fitness goals or a trainer wanting to deliver exceptional results, Juice has you covered as the best personal training software.",
      }
    }
  }

  const { smallHeader, header, description } = getPageSpecificContent()

  return (
    <div className={`pt-8 pb-0 ${isCoach ? "bg-white" : "bg-black"} maintain-scroll`}>
      <div className="container px-4 md:px-6 pb-4">
        <div
          className={`flex flex-col mb-12 ${isPersonalTrainerAppPage ? "items-start text-left" : "items-center text-center"}`}
        >
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>{smallHeader}</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>{header}</h2>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} max-w-2xl`}>{description}</p>
        </div>

        {!isPersonalTrainerAppPage ? (
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
              <div id="trainer-features" className="grid grid-cols-1 gap-4 md:gap-6">
                {trainerFeatures.map((feature, index) => (
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
          </Tabs>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <div id="trainer-features" className="grid grid-cols-1 gap-4 md:gap-6">
              {trainerFeatures.map((feature, index) => (
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
          </div>
        )}
      </div>
    </div>
  )
}
