"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Calendar, MessageSquare, Zap } from "lucide-react"

export default function PersonalTrainerWebsitePage() {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "premium">("pro")

  const features = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: "Professional Website",
      description: "Beautiful, mobile-responsive website with your branding",
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Client Management",
      description: "Manage client profiles, progress tracking, and communication",
    },
    {
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      title: "Online Booking",
      description: "Let clients book sessions directly through your website",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-orange-500" />,
      title: "Client Portal",
      description: "Secure area for clients to access workouts and nutrition plans",
    },
    {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      title: "Review System",
      description: "Collect and display client testimonials and reviews",
    },
    {
      icon: <Zap className="h-5 w-5 text-red-500" />,
      title: "Analytics Dashboard",
      description: "Track website performance and client engagement",
    },
  ]

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for new trainers getting started",
      features: [
        "Professional website",
        "Basic client management",
        "Online booking (up to 50 sessions/month)",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Professional",
      price: "$59",
      period: "/month",
      description: "Most popular for established trainers",
      features: [
        "Everything in Basic",
        "Advanced client portal",
        "Unlimited booking",
        "Review system",
        "Basic analytics",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "For trainers running a full business",
      features: [
        "Everything in Professional",
        "Advanced analytics",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "24/7 phone support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Personal Training{" "}
              </span>
              Empire
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get a professional website, client management system, and online booking platform designed specifically
              for personal trainers. Start growing your business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to run a successful personal training business online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all cursor-pointer ${
                  plan.popular
                    ? "border-blue-500 shadow-xl scale-105"
                    : selectedPlan === plan.id
                      ? "border-blue-300 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan(plan.id as "basic" | "pro" | "premium")}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${
                      plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Training Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful trainers who have built their online presence with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
