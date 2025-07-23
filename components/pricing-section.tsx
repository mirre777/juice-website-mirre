"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

export default function PricingSection() {
  const { isCoach } = useTheme()

  const coachPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for new trainers getting started",
      features: [
        "Up to 10 clients",
        "Basic workout builder",
        "Progress tracking",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$59",
      period: "/month",
      description: "Most popular for growing trainers",
      features: [
        "Up to 50 clients",
        "Advanced workout builder",
        "Detailed analytics",
        "Priority support",
        "Custom branding",
        "Payment processing",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For established training businesses",
      features: [
        "Unlimited clients",
        "White-label solution",
        "Advanced integrations",
        "Dedicated support",
        "Custom features",
        "API access",
      ],
      popular: false,
    },
  ]

  const clientPlans = [
    {
      name: "Basic",
      price: "$9",
      period: "/month",
      description: "Essential features for fitness tracking",
      features: ["Workout logging", "Progress tracking", "Basic analytics", "Community access", "Mobile app"],
      popular: false,
    },
    {
      name: "Premium",
      price: "$19",
      period: "/month",
      description: "Complete fitness solution",
      features: [
        "Everything in Basic",
        "Personal trainer matching",
        "Custom workout plans",
        "Nutrition tracking",
        "Priority support",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "$39",
      period: "/month",
      description: "Premium experience with 1-on-1 coaching",
      features: [
        "Everything in Premium",
        "Dedicated personal trainer",
        "Weekly video calls",
        "Custom meal plans",
        "24/7 support",
        "Exclusive content",
      ],
      popular: false,
    },
  ]

  const plans = isCoach ? coachPlans : clientPlans

  return (
    <section id="pricing" className={`py-20 ${isCoach ? "bg-gray-50" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Simple, transparent pricing for trainers" : "Choose your fitness journey"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Start free and scale as you grow. No hidden fees, no long-term contracts."
              : "Flexible plans designed to fit your fitness goals and budget."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? `ring-2 ring-orange-500 ${isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700"}`
                  : isCoach
                    ? "bg-white"
                    : "bg-zinc-800 border-zinc-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className={`text-2xl ${isCoach ? "text-black" : "text-white"}`}>{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${isCoach ? "text-black" : "text-white"}`}>{plan.price}</span>
                  <span className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>{plan.period}</span>
                </div>
                <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className={`text-sm ${isCoach ? "text-gray-700" : "text-gray-300"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : isCoach
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-zinc-700 hover:bg-zinc-600 text-white"
                  }`}
                >
                  {isCoach ? "Start Free Trial" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className={`text-sm ${isCoach ? "text-gray-600" : "text-gray-400"}`}>
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
