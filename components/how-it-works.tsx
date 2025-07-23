"use client"

import { useTheme } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Calendar, BarChart3, Smartphone } from "lucide-react"

export function HowItWorks() {
  const { isCoach } = useTheme()

  const coachSteps = [
    {
      step: 1,
      title: "Set Up Your Profile",
      description: "Create your trainer profile with certifications, specialties, and availability.",
      icon: Users,
    },
    {
      step: 2,
      title: "Add Your Clients",
      description: "Invite clients to join your platform and set up their individual profiles and goals.",
      icon: Users,
    },
    {
      step: 3,
      title: "Create Workout Plans",
      description: "Design personalized workout routines using our extensive exercise library.",
      icon: Calendar,
    },
    {
      step: 4,
      title: "Track Progress",
      description: "Monitor client progress, adjust plans, and celebrate achievements together.",
      icon: BarChart3,
    },
  ]

  const clientSteps = [
    {
      step: 1,
      title: "Download the App",
      description: "Get started with our simple, intuitive mobile app available on iOS and Android.",
      icon: Smartphone,
    },
    {
      step: 2,
      title: "Find Your Trainer",
      description: "Browse certified trainers in your area or connect with your existing trainer.",
      icon: Users,
    },
    {
      step: 3,
      title: "Start Training",
      description: "Follow your personalized workout plans and log your progress in real-time.",
      icon: Calendar,
    },
    {
      step: 4,
      title: "See Results",
      description: "Track your improvements with detailed analytics and celebrate your achievements.",
      icon: BarChart3,
    },
  ]

  const steps = isCoach ? coachSteps : clientSteps

  return (
    <section id="how-it-works" className={`py-20 ${isCoach ? "bg-gray-50" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Start coaching in 4 simple steps" : "Get fit in 4 simple steps"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "From setup to success, here's how Juice helps you build and grow your personal training business."
              : "From download to results, here's how Juice helps you achieve your fitness goals."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <Card className={`h-full ${isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700"}`}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Step {step.step}
                    </Badge>
                  </div>
                  <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-center ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className={`h-6 w-6 ${isCoach ? "text-gray-400" : "text-zinc-600"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
