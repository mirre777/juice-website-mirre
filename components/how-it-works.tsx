"use client"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Settings, Rocket, Target } from "lucide-react"

export function HowItWorks() {
  const { isCoach } = useTheme()

  const coachSteps = [
    {
      icon: UserPlus,
      title: "Sign Up & Setup",
      description: "Create your coach profile, set your specialties, and customize your training programs.",
    },
    {
      icon: Settings,
      title: "Build Your Programs",
      description: "Use our workout builder to create custom training plans and set your pricing.",
    },
    {
      icon: Target,
      title: "Find Clients",
      description: "Get matched with clients who need your expertise and training style.",
    },
    {
      icon: Rocket,
      title: "Grow Your Business",
      description: "Scale your coaching business with our tools for client management and analytics.",
    },
  ]

  const clientSteps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Tell us about your fitness goals, experience level, and preferences.",
    },
    {
      icon: Target,
      title: "Get Matched",
      description: "Our algorithm connects you with the perfect coach for your needs.",
    },
    {
      icon: Settings,
      title: "Start Training",
      description: "Receive your personalized workout plan and begin your fitness journey.",
    },
    {
      icon: Rocket,
      title: "Track Progress",
      description: "Monitor your improvements and celebrate your achievements along the way.",
    },
  ]

  const steps = isCoach ? coachSteps : clientSteps

  return (
    <section className={`py-20 ${isCoach ? "bg-gray-50" : "bg-zinc-800"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Start coaching in 4 simple steps" : "Your fitness journey starts here"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Get up and running quickly with our streamlined onboarding process."
              : "Getting started with your fitness transformation is easier than you think."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`relative ${
                isCoach ? "bg-white border-gray-200" : "bg-zinc-900 border-zinc-700"
              } hover:shadow-lg transition-shadow`}
            >
              <CardHeader className="text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <step.icon className="h-12 w-12 text-orange-500 mx-auto mb-4 mt-4" />
                <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={`text-center ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
