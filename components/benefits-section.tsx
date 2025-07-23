"use client"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, Shield, Heart } from "lucide-react"

export function BenefitsSection() {
  const { isCoach } = useTheme()

  const coachBenefits = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Grow your income by 3x with our proven client acquisition and retention strategies.",
      stat: "300%",
      statLabel: "Average Revenue Increase",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Automate administrative tasks and focus on what you do best - coaching clients.",
      stat: "15hrs",
      statLabel: "Saved Per Week",
    },
    {
      icon: Shield,
      title: "Professional Tools",
      description: "Access enterprise-grade tools typically reserved for large fitness chains.",
      stat: "50+",
      statLabel: "Professional Features",
    },
    {
      icon: Heart,
      title: "Better Client Results",
      description: "Help your clients achieve better results with data-driven insights and tracking.",
      stat: "85%",
      statLabel: "Client Success Rate",
    },
  ]

  const clientBenefits = [
    {
      icon: TrendingUp,
      title: "Faster Results",
      description: "Achieve your fitness goals 2x faster with personalized coaching and accountability.",
      stat: "2x",
      statLabel: "Faster Goal Achievement",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work out on your schedule with 24/7 access to your personalized training plans.",
      stat: "24/7",
      statLabel: "Access to Workouts",
    },
    {
      icon: Shield,
      title: "Expert Guidance",
      description: "Get professional coaching from certified trainers without the premium price tag.",
      stat: "100%",
      statLabel: "Certified Trainers",
    },
    {
      icon: Heart,
      title: "Stay Motivated",
      description: "Maintain consistency with built-in accountability and progress tracking features.",
      stat: "90%",
      statLabel: "Workout Completion Rate",
    },
  ]

  const benefits = isCoach ? coachBenefits : clientBenefits

  return (
    <section className={`py-20 ${isCoach ? "bg-white" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Benefits
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Why coaches choose Juice" : "Why clients love Juice"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Join thousands of successful coaches who have transformed their business with our platform."
              : "Experience the difference that personalized coaching and smart technology can make."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`text-center ${
                isCoach ? "bg-white border-gray-200" : "bg-zinc-800 border-zinc-700"
              } hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <benefit.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {benefit.description}
                </CardDescription>
                <div className="pt-4 border-t border-gray-200">
                  <div className={`text-3xl font-bold text-orange-500`}>{benefit.stat}</div>
                  <div className={`text-sm ${isCoach ? "text-gray-500" : "text-gray-400"}`}>{benefit.statLabel}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
