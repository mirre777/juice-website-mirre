"use client"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, BarChart3, Smartphone, CreditCard, MessageSquare } from "lucide-react"

export function FeaturesSection() {
  const { isCoach } = useTheme()

  const coachFeatures = [
    {
      icon: Users,
      title: "Client Management",
      description: "Organize and track all your clients in one place with detailed profiles and progress tracking.",
    },
    {
      icon: Calendar,
      title: "Workout Builder",
      description: "Create custom workout plans with our intuitive drag-and-drop builder and exercise library.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track client progress, engagement metrics, and business growth with detailed analytics.",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Stay connected with your clients on-the-go with our fully-featured mobile application.",
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Handle payments, subscriptions, and invoicing seamlessly within the platform.",
    },
    {
      icon: MessageSquare,
      title: "Client Communication",
      description: "Built-in messaging system to keep in touch with clients and provide real-time support.",
    },
  ]

  const clientFeatures = [
    {
      icon: Users,
      title: "Expert Coaches",
      description: "Connect with certified personal trainers who match your fitness goals and preferences.",
    },
    {
      icon: Calendar,
      title: "Custom Workouts",
      description: "Get personalized workout plans tailored to your fitness level and available equipment.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your fitness journey with detailed progress tracking and performance analytics.",
    },
    {
      icon: Smartphone,
      title: "Mobile Workouts",
      description: "Access your workouts anywhere with our mobile app, complete with video demonstrations.",
    },
    {
      icon: CreditCard,
      title: "Flexible Pricing",
      description: "Choose from various coaching packages that fit your budget and commitment level.",
    },
    {
      icon: MessageSquare,
      title: "Direct Support",
      description: "Get real-time feedback and motivation from your personal trainer through in-app messaging.",
    },
  ]

  const features = isCoach ? coachFeatures : clientFeatures

  return (
    <section className={`py-20 ${isCoach ? "bg-white" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Everything you need to grow your business" : "Everything you need to reach your goals"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Powerful tools designed specifically for fitness professionals to manage clients and scale their business."
              : "Comprehensive features to help you stay motivated, track progress, and achieve lasting results."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${
                isCoach ? "bg-white border-gray-200" : "bg-zinc-800 border-zinc-700"
              } hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <feature.icon className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
