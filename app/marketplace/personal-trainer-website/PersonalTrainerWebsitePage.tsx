"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Calendar, MessageSquare, Edit3, Eye, Smartphone, Monitor, Tablet } from "lucide-react"
import Link from "next/link"

export default function PersonalTrainerWebsitePage() {
  const [activeTab, setActiveTab] = useState("features")

  const features = [
    {
      icon: <Edit3 className="h-6 w-6" />,
      title: "Live Content Editor",
      description: "Edit your website content in real-time with our intuitive editor",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from beautifully designed templates optimized for fitness professionals",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Management",
      description: "Showcase your services and make it easy for clients to contact you",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Booking Integration",
      description: "Seamlessly integrate with booking systems and scheduling tools",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Contact Forms",
      description: "Built-in contact forms to capture leads and client inquiries",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Responsive",
      description: "Your website looks perfect on all devices - mobile, tablet, and desktop",
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for new trainers getting started",
      features: [
        "Professional website template",
        "Basic content editor",
        "Contact form",
        "Mobile responsive design",
        "SSL certificate included",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$59",
      period: "/month",
      description: "Most popular choice for established trainers",
      features: [
        "Everything in Starter",
        "Advanced content editor",
        "Custom domain",
        "SEO optimization",
        "Analytics dashboard",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "For trainers who want it all",
      features: [
        "Everything in Professional",
        "Multiple website templates",
        "Advanced integrations",
        "Custom branding",
        "White-label solution",
        "24/7 dedicated support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 New: Live Content Editor Now Available
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Professional Websites for
              <span className="text-blue-600 block">Personal Trainers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create a stunning, professional website that showcases your expertise and attracts more clients. No coding
              required - just edit, customize, and launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace/trainer/temp">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Create Your Website
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                View Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: "features", label: "Features" },
              { id: "templates", label: "Templates" },
              { id: "pricing", label: "Pricing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Tab */}
      {activeTab === "features" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed Online</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform provides all the tools you need to create a professional online presence
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Beautiful Templates Designed for Trainers</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of professionally designed templates
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Template Preview Cards */}
              <Card className="overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">Modern Fitness</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Modern Fitness Template</h3>
                  <p className="text-gray-600 mb-4">
                    Clean, modern design perfect for personal trainers and fitness coaches
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Preview Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Tablet className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">Wellness Pro</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Wellness Pro Template</h3>
                  <p className="text-gray-600 mb-4">Professional template focused on health and wellness services</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Preview Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">Strength Coach</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Strength Coach Template</h3>
                  <p className="text-gray-600 mb-4">Bold design perfect for strength and conditioning coaches</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Preview Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include our core features.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? "border-blue-500 border-2 shadow-xl" : "shadow-lg"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Professional Website?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of trainers who have already created their online presence with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace/trainer/temp">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Start Building Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
