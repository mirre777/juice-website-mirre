"use client"

import { useTheme } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Users, Clock, DollarSign, Heart, Target, Zap } from "lucide-react"

export function BenefitsSection() {
  const { isCoach } = useTheme()

  const coachBenefits = [
    {
      icon: DollarSign,
      title: "Increase Revenue",
      description: "Streamline your business operations and take on more clients with automated tools.",
      stats: "Average 40% revenue increase",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Reduce administrative work with automated scheduling, billing, and progress tracking.",
      stats: "Save 10+ hours per week",
    },
    {
      icon: Users,
      title: "Better Client Retention",
      description: "Keep clients engaged with personalized plans and consistent communication.",
      stats: "85% client retention rate",
    },
    {
      icon: TrendingUp,
      title: "Scale Your Business",
      description: "Manage more clients efficiently without compromising on service quality.",
      stats: "Handle 3x more clients",
    },
  ]

  const clientBenefits = [
    {
      icon: Target,
      title: "Achieve Your Goals",
      description: "Personalized workout plans designed specifically for your fitness objectives.",
      stats: "90% goal achievement rate",
    },
    {
      icon: Heart,
      title: "Stay Motivated",
      description: "Regular check-ins, progress tracking, and community support keep you on track.",
      stats: "3x more likely to stick to routine",
    },
    {
      icon: Zap,
      title: "See Faster Results",
      description: "Expert guidance and optimized training plans accelerate your progress.",
      stats: "Results 50% faster",
    },
    {
      icon: CheckCircle,
      title: "Build Healthy Habits",
      description: "Develop sustainable fitness habits that last a lifetime with professional support.",
      stats: "95% habit formation success",
    },
  ]

  const benefits = isCoach ? coachBenefits : clientBenefits

  return (
    <section className={`py-20 ${isCoach ? "bg-white" : "bg-black"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Benefits
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Why trainers choose Juice" : "Why clients love Juice"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Join thousands of successful trainers who have transformed their business with our platform."
              : "Join thousands of satisfied clients who have achieved their fitness goals with professional guidance."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`${isCoach ? "bg-gray-50 border-gray-200" : "bg-zinc-900 border-zinc-800"} hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-xl ${isCoach ? "text-black" : "text-white"}`}>
                      {benefit.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {benefit.stats}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"} text-base`}>
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
