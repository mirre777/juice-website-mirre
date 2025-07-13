"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Globe, Sparkles, Play } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

export default function PersonalTrainerWebsitePage() {
  const trainerExamples = [
    {
      id: "777",
      name: "Marcus Thompson",
      style: "Floating Cards",
      specialty: "Strength & Conditioning",
      image: "/images/lemon-trainer.png",
      description: "Interactive sidebar with floating achievement cards",
    },
    {
      id: "888",
      name: "Sarah Chen",
      style: "Hero Layout",
      specialty: "Yoga & Wellness",
      image: "/images/lemon-trainer-serious.png",
      description: "Split-screen hero with bold taglines and floating stats",
    },
    {
      id: "999",
      name: "Alex Rivera",
      style: "Dark Minimalist",
      specialty: "Performance Coach",
      image: "/images/lemon-trainer-intense.png",
      description: "Dark theme with dramatic imagery and clean typography",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <Badge className="mb-4 bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Generation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get Your Professional
              <span className="block">
                <span className="bg-[#D2FF28] text-black px-4 py-2 rounded-lg inline-block">Trainer Website</span>
              </span>
              <span className="block mt-4">in 10 Seconds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl">
              Join thousands of trainers using AI to create stunning, client-attracting websites. Connected to Juice's
              marketplace to help you find and manage clients effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                size="lg"
                className="bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 text-lg px-8 py-6"
                onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Zap className="w-5 h-5 mr-2" />
                Create My Website Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}

      {/* Examples Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Creates Unique Designs for Every Trainer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI analyzes your specialty, experience, and personality to create a website that perfectly represents
              your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainerExamples.map((trainer) => (
              <Card key={trainer.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{trainer.style}</Badge>
                    <Link href={`/marketplace/trainer/${trainer.id}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Globe className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                    </Link>
                  </div>
                  <CardTitle className="text-xl">{trainer.name}</CardTitle>
                  <p className="text-[#D2FF28] font-medium">{trainer.specialty}</p>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-gray-600 text-sm">{trainer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Form Section */}
      <section id="generator" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Create Your Website Now</h2>
            <p className="text-xl text-gray-600">
              Fill out your details and watch AI create your professional trainer website in seconds.
            </p>
          </div>

          <Card className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Here you would save to database
                // For now, redirect to temp page
                window.location.href = "/marketplace/trainer/temp"
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Training Specialty *
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                  >
                    <option value="">Select your specialty</option>
                    <option value="Personal Training">Personal Training</option>
                    <option value="Strength & Conditioning">Strength & Conditioning</option>
                    <option value="Yoga & Wellness">Yoga & Wellness</option>
                    <option value="Nutrition Coaching">Nutrition Coaching</option>
                    <option value="Sports Performance">Sports Performance</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Group Fitness">Group Fitness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                  >
                    <option value="">Select experience</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <input
                  type="text"
                  id="certifications"
                  name="certifications"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent"
                  placeholder="e.g., NASM-CPT, ACE, ACSM (separate with commas)"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio *
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2FF28] focus:border-transparent resize-none"
                  placeholder="Tell potential clients about your training philosophy, experience, and what makes you unique..."
                />
              </div>

              <div>
                <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "One-on-One Training",
                    "Group Sessions",
                    "Online Coaching",
                    "Nutrition Planning",
                    "Workout Programs",
                    "Fitness Assessments",
                  ].map((service) => (
                    <label key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="services"
                        value={service}
                        className="rounded border-gray-300 text-[#D2FF28] focus:ring-[#D2FF28]"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#D2FF28]/10 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                      1
                    </div>
                    <span>AI generates your website in 10 seconds</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                      2
                    </div>
                    <span>Preview your professional trainer page</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                      3
                    </div>
                    <span>Complete payment (€29 one-time)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-[#D2FF28] rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                      4
                    </div>
                    <span>Get your unique URL to share</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#D2FF28] text-black hover:bg-[#D2FF28]/90 text-lg py-6"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate My Website Now
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}

      {/* CTA Section */}
      <section className="py-20 bg-[#D2FF28]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Ready to Get More Clients?</h2>
          <p className="text-xl text-black/80 mb-8">
            Join thousands of trainers who've transformed their business with AI-generated websites.
          </p>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6"
            onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}
          >
            Create My Website Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
