"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Award,
  Instagram,
  Facebook,
  Twitter,
  Star,
  Download,
  Menu,
} from "lucide-react"

interface TrainerProfilePageProps {
  trainerId: string
}

// Mock trainer data - in real app this would come from API
const getTrainerData = (id: string) => {
  const trainers: Record<string, any> = {
    "777": {
      name: "Marcus Johnson",
      title: "Elite Personal Trainer & Nutrition Coach",
      location: "Los Angeles, CA",
      email: "marcus@juicetraining.com",
      phone: "+1 (555) 123-4567",
      rating: 4.9,
      reviewCount: 127,
      yearsExperience: 8,
      clientsTransformed: 200,
      specializations: ["Strength Training", "Weight Loss", "Nutrition", "HIIT", "Bodybuilding"],
      certifications: ["NASM-CPT", "Precision Nutrition", "ACSM", "FMS Level 2"],
      bio: "Elite personal trainer with 8 years of experience transforming lives through fitness. Specialized in strength training, weight loss, and nutrition coaching. I've helped over 200 clients achieve their fitness goals with personalized training programs and sustainable lifestyle changes.",
      achievements: [
        "Transformed 200+ clients",
        "NASM Master Trainer",
        "Nutrition Specialist",
        "Former Competitive Bodybuilder",
      ],
      services: [
        {
          name: "Personal Training",
          description: "One-on-one customized workout sessions tailored to your goals",
          icon: Dumbbell,
        },
        {
          name: "Nutrition Coaching",
          description: "Comprehensive meal planning and nutritional guidance",
          icon: Heart,
        },
        {
          name: "HIIT Programs",
          description: "High-intensity interval training for maximum results",
          icon: Zap,
        },
        {
          name: "Competition Prep",
          description: "Specialized training for bodybuilding and fitness competitions",
          icon: Trophy,
        },
      ],
      skills: [
        { name: "Strength Training", level: 95 },
        { name: "Nutrition Coaching", level: 90 },
        { name: "Weight Loss", level: 92 },
        { name: "HIIT Training", level: 88 },
        { name: "Bodybuilding", level: 94 },
      ],
      pricing: [
        {
          name: "Single Session",
          price: "$120",
          description: "One 60-minute personal training session",
        },
        {
          name: "4-Session Package",
          price: "$440",
          description: "Four sessions with 8% savings",
          popular: true,
        },
        {
          name: "Monthly Unlimited",
          price: "$1,200",
          description: "Unlimited sessions + nutrition plan",
        },
      ],
      image: "/placeholder-user.jpg",
      socialLinks: {
        instagram: "@marcusfitness",
        facebook: "MarcusJohnsonFitness",
        twitter: "@marcusfit",
      },
      style: "floating",
    },
    "888": {
      name: "Sarah Chen",
      title: "Functional Movement Specialist",
      location: "New York, NY",
      email: "sarah@juicetraining.com",
      phone: "+1 (555) 987-6543",
      rating: 4.8,
      reviewCount: 89,
      yearsExperience: 6,
      clientsTransformed: 150,
      specializations: ["Functional Training", "Mobility", "Injury Prevention", "Yoga", "Pilates"],
      certifications: ["FMS Level 3", "RYT-500", "NASM-CES", "Pilates Instructor"],
      bio: "Passionate about helping people move better and feel stronger. I specialize in functional movement patterns, mobility work, and injury prevention. My approach combines traditional strength training with yoga and pilates principles to create balanced, sustainable fitness routines.",
      tagline: "I TRAIN TO TRANSFORM LIVES.",
      achievements: [
        "150+ clients transformed",
        "Functional Movement Expert",
        "Yoga & Pilates Certified",
        "Injury Prevention Specialist",
      ],
      services: [
        {
          name: "Functional Training",
          description: "Movement-based training for real-world strength and mobility",
          icon: Target,
        },
        {
          name: "Mobility & Flexibility",
          description: "Improve range of motion and prevent injuries",
          icon: Heart,
        },
        {
          name: "Yoga & Pilates",
          description: "Mind-body connection through controlled movements",
          icon: Zap,
        },
        {
          name: "Injury Prevention",
          description: "Corrective exercises and movement screening",
          icon: Award,
        },
      ],
      skills: [
        { name: "Functional Movement", level: 98 },
        { name: "Mobility Training", level: 95 },
        { name: "Yoga Instruction", level: 92 },
        { name: "Injury Prevention", level: 90 },
        { name: "Pilates", level: 88 },
      ],
      pricing: [
        {
          name: "Single Session",
          price: "$100",
          description: "One 60-minute functional training session",
        },
        {
          name: "Movement Assessment",
          price: "$150",
          description: "Comprehensive movement screening + plan",
          popular: true,
        },
        {
          name: "Monthly Package",
          price: "$800",
          description: "8 sessions + mobility program",
        },
      ],
      image: "/placeholder-user.jpg",
      socialLinks: {
        instagram: "@sarahfitness",
        facebook: "SarahChenFitness",
        twitter: "@sarahtrains",
      },
      style: "hero",
    },
    "999": {
      name: "Alex Rivera",
      title: "Performance & Health Coach",
      location: "Miami, FL",
      email: "alex@juicetraining.com",
      phone: "+1 (555) 456-7890",
      rating: 4.9,
      reviewCount: 156,
      yearsExperience: 10,
      clientsTransformed: 300,
      specializations: ["Performance Training", "Athletic Conditioning", "Recovery", "Mental Coaching"],
      certifications: ["CSCS", "USAW Level 2", "Precision Nutrition", "Mental Performance"],
      bio: "A healthy balance between performance and wellness. I help athletes and fitness enthusiasts reach their peak potential through evidence-based training methods and holistic health approaches.",
      tagline: "PEAK PERFORMANCE THROUGH BALANCE",
      achievements: [
        "300+ athletes trained",
        "Olympic Weightlifting Coach",
        "Performance Specialist",
        "Mental Health Advocate",
      ],
      services: [
        {
          name: "Athletic Performance",
          description: "Sport-specific training for competitive athletes",
          icon: Trophy,
        },
        {
          name: "Strength & Conditioning",
          description: "Build power, speed, and endurance systematically",
          icon: Dumbbell,
        },
        {
          name: "Recovery Protocols",
          description: "Optimize rest and recovery for peak performance",
          icon: Heart,
        },
        {
          name: "Mental Coaching",
          description: "Develop mental resilience and focus",
          icon: Target,
        },
      ],
      skills: [
        { name: "Athletic Performance", level: 98 },
        { name: "Strength Training", level: 96 },
        { name: "Recovery Methods", level: 92 },
        { name: "Mental Coaching", level: 89 },
        { name: "Nutrition Planning", level: 91 },
      ],
      pricing: [
        {
          name: "Performance Session",
          price: "$150",
          description: "One 90-minute performance training session",
        },
        {
          name: "Athlete Package",
          price: "$1,000",
          description: "8 sessions + recovery plan + nutrition",
          popular: true,
        },
        {
          name: "Elite Program",
          price: "$2,500",
          description: "Monthly comprehensive performance program",
        },
      ],
      image: "/placeholder-user.jpg",
      socialLinks: {
        instagram: "@alexperformance",
        facebook: "AlexRiveraCoach",
        twitter: "@alexcoach",
      },
      style: "dark",
    },
  }

  return trainers[id] || null
}

// Floating card style component (existing style for 777)
function FloatingCardStyle({ trainer, activeSection, setActiveSection }: any) {
  const sidebarItems = [
    { id: "about", icon: User, label: "About" },
    { id: "services", icon: Target, label: "Services" },
    { id: "skills", icon: Award, label: "Skills" },
    { id: "pricing", icon: Calendar, label: "Pricing" },
  ]

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <div className="absolute inset-0 bg-white" />

      <div className="relative flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-20 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-8 z-10">
          <div className="mb-8">
            <div className="w-10 h-10 bg-[#D2FF28] rounded-lg flex items-center justify-center text-black font-bold text-lg">
              J
            </div>
          </div>

          <nav className="flex flex-col gap-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-[#D2FF28]/20 text-black"
                    : "text-gray-400 hover:text-black hover:bg-gray-200"
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-20">
          <div className="flex">
            {/* Left Panel - Floating Trainer Card */}
            <div className="w-1/2 p-8 flex flex-col justify-center items-center min-h-screen relative">
              {/* Floating Info Cards */}
              <div className="absolute top-20 left-8 animate-float">
                <Card className="bg-white border-gray-200 w-48 p-4 shadow-lg">
                  <CardContent className="p-0">
                    <h3 className="text-black font-semibold mb-2">Experience</h3>
                    <p className="text-sm text-gray-600">
                      {trainer.yearsExperience} years of professional training experience
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute top-32 right-8 animate-float" style={{ animationDelay: "1s" }}>
                <Card className="bg-white border-gray-200 w-40 p-4 shadow-lg">
                  <CardContent className="p-0 text-center">
                    <div className="text-2xl font-bold text-[#D2FF28] mb-1">{trainer.clientsTransformed}+</div>
                    <p className="text-xs text-gray-600">Clients Transformed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute bottom-32 left-12 animate-float" style={{ animationDelay: "2s" }}>
                <Card className="bg-white border-gray-200 w-44 p-4 shadow-lg">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-[#D2FF28] fill-current" />
                      <span className="text-[#D2FF28] font-semibold">{trainer.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600">{trainer.reviewCount} reviews</p>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute bottom-20 right-12 animate-float" style={{ animationDelay: "3s" }}>
                <Card className="bg-white border-gray-200 w-36 p-4 shadow-lg">
                  <CardContent className="p-0 text-center">
                    <MapPin className="w-5 h-5 text-[#D2FF28] mx-auto mb-2" />
                    <p className="text-xs text-gray-600">{trainer.location}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Central Trainer Card */}
              <Card className="bg-white border-gray-200 max-w-md w-full relative z-10 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden mx-auto border-4 border-[#D2FF28]/30 shadow-lg">
                      <img
                        src={trainer.image || "/placeholder.svg"}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-[#D2FF28] text-black px-3 py-1 rounded-full text-sm font-semibold">
                      Hello I'm
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-2 text-black">{trainer.name}</h1>
                  <p className="text-[#D2FF28] text-lg mb-6 font-semibold">{trainer.title}</p>

                  <div className="space-y-3 mb-6 text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{trainer.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{trainer.phone}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Instagram className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Facebook className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Twitter className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <Button className="bg-[#D2FF28] hover:bg-[#D2FF28]/90 text-black font-semibold px-8 py-3 rounded-lg w-full">
                    Book Training Session
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Dynamic Content */}
            <div className="w-1/2 p-8 min-h-screen">
              {activeSection === "about" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-4 text-black">about me</h2>
                    <div className="flex gap-4 text-[#D2FF28] mb-6 font-semibold">
                      <span>{trainer.yearsExperience} years experience</span>
                      <span>/</span>
                      <span>{trainer.clientsTransformed}+ clients</span>
                      <span>/</span>
                      <span>{trainer.rating}★ rating</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-8">{trainer.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-black">
                      <Trophy className="w-6 h-6 text-[#D2FF28]" />
                      achievements
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {trainer.achievements.map((achievement: string, index: number) => (
                        <Card key={index} className="bg-gray-50 border-gray-200">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-700">{achievement}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-black">specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specializations.map((spec: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[#D2FF28]/20 text-black border-[#D2FF28]/30 hover:bg-[#D2FF28]/30"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "services" && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold mb-8 text-black">my services</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {trainer.services.map((service: any, index: number) => (
                      <Card
                        key={index}
                        className="bg-white border-gray-200 hover:border-[#D2FF28]/50 transition-colors shadow-sm hover:shadow-md"
                      >
                        <CardContent className="p-6">
                          <service.icon className="w-8 h-8 text-[#D2FF28] mb-4" />
                          <h3 className="text-xl font-semibold mb-2 text-black">{service.name}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "skills" && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold mb-8 flex items-center gap-2 text-black">
                    <Award className="w-8 h-8 text-[#D2FF28]" />
                    skills
                  </h2>
                  <div className="space-y-6">
                    {trainer.skills.map((skill: any, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-black font-medium">{skill.name}</span>
                          <span className="text-[#D2FF28] font-bold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#D2FF28] h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-200" />

                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-black">certifications</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {trainer.certifications.map((cert: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-[#D2FF28]/30 text-black justify-center py-2 hover:bg-[#D2FF28]/10"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "pricing" && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold mb-8 text-black">my pricing</h2>
                  <div className="space-y-4">
                    {trainer.pricing.map((plan: any, index: number) => (
                      <Card
                        key={index}
                        className={`bg-white border-gray-200 ${
                          plan.popular ? "border-[#D2FF28]/50 bg-[#D2FF28]/5" : ""
                        } shadow-sm`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-1 text-black">{plan.name}</h3>
                              <p className="text-gray-600 text-sm">{plan.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#D2FF28]">{plan.price}</div>
                              {plan.popular && <Badge className="bg-[#D2FF28] text-black text-xs mt-1">Popular</Badge>}
                            </div>
                          </div>
                          <Button
                            className={`w-full ${
                              plan.popular
                                ? "bg-[#D2FF28] hover:bg-[#D2FF28]/90 text-black"
                                : "bg-gray-100 hover:bg-gray-200 text-black"
                            }`}
                          >
                            Select Plan
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hero style component (existing style for 888)
function HeroStyle({ trainer }: any) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-12 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D2FF28] rounded-lg flex items-center justify-center text-black font-bold">
              J
            </div>
            <span className="font-bold text-black">Juice</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#about" className="text-gray-600 hover:text-black transition-colors">
              About
            </a>
            <a href="#services" className="text-gray-600 hover:text-black transition-colors">
              Services
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-600 hover:text-black transition-colors">
              Contact
            </a>
          </div>
          <Button className="bg-[#D2FF28] hover:bg-[#D2FF28]/90 text-black">Book Session</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Content */}
        <div className="w-1/2 flex flex-col justify-center p-12 bg-gray-50">
          <div className="max-w-lg">
            <div className="mb-6">
              <Badge className="bg-[#D2FF28] text-black mb-4">Functional Movement</Badge>
              <h1 className="text-5xl font-bold text-black mb-4 leading-tight">
                {trainer.tagline || "I TRAIN TO TRANSFORM LIVES."}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{trainer.bio}</p>
            </div>

            <div className="flex gap-4 mb-8">
              <Button className="bg-[#D2FF28] hover:bg-[#D2FF28]/90 text-black font-semibold px-8 py-3">
                Book Session
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-black hover:bg-gray-100 px-8 py-3 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>

            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{trainer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{trainer.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 relative bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <img
                src={trainer.image || "/placeholder.svg"}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute top-20 right-20">
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <CardContent className="p-0 text-center">
                <div className="text-2xl font-bold text-[#D2FF28] mb-1">{trainer.yearsExperience}</div>
                <p className="text-xs text-gray-600">Years Experience</p>
              </CardContent>
            </Card>
          </div>

          <div className="absolute bottom-32 left-20">
            <Card className="bg-white border-gray-200 p-4 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[#D2FF28] fill-current" />
                  <span className="text-[#D2FF28] font-semibold">{trainer.rating}</span>
                </div>
                <p className="text-xs text-gray-600">{trainer.reviewCount} reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
            <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Instagram className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Facebook className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Twitter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-12">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">Specializations</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {trainer.specializations.map((spec: string, index: number) => (
              <Badge key={index} className="bg-[#D2FF28] text-black px-6 py-2 text-sm font-medium">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dark minimalist style component (new style for 999)
function DarkStyle({ trainer }: any) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      

      {/* Hero Section */}
      <div className="relative z-10 flex min-h-[calc(100vh-100px)]">
        {/* Left Side - Content */}
        <div className="w-1/2 flex flex-col justify-center p-12">
          <div className="max-w-lg">
            <div className="mb-8">
              <p className="text-gray-400 text-lg mb-4">{trainer.title}</p>
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">{trainer.name}</h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{trainer.bio}</p>
            </div>

            <div className="flex gap-4 mb-8">
              <Button className="bg-[#D2FF28] hover:bg-[#D2FF28]/90 text-black font-semibold px-8 py-3">
                Services
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 bg-transparent"
              >
                About Me
              </Button>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{trainer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{trainer.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 relative flex items-center justify-center">
          <div className="relative">
            <div className="w-96 h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={trainer.image || "/placeholder.svg"}
                alt={trainer.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-8 -right-8">
              <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm p-4">
                <CardContent className="p-0 text-center">
                  <div className="text-2xl font-bold text-[#D2FF28] mb-1">{trainer.yearsExperience}</div>
                  <p className="text-xs text-gray-400">Years Experience</p>
                </CardContent>
              </Card>
            </div>

            <div className="absolute -bottom-8 -left-8">
              <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[#D2FF28] fill-current" />
                    <span className="text-[#D2FF28] font-semibold">{trainer.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">{trainer.reviewCount} reviews</p>
                </CardContent>
              </Card>
            </div>

            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2">
              <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm p-4">
                <CardContent className="p-0 text-center">
                  <div className="text-xl font-bold text-[#D2FF28] mb-1">{trainer.clientsTransformed}+</div>
                  <p className="text-xs text-gray-400">Athletes Trained</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Social Links */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
            <button className="p-3 bg-gray-900/80 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors">
              <Instagram className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-3 bg-gray-900/80 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors">
              <Facebook className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-3 bg-gray-900/80 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors">
              <Twitter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Specializations */}
      <div className="relative z-10 px-12 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4 flex-wrap">
            {trainer.specializations.map((spec: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="border-gray-600 text-gray-300 px-6 py-2 text-sm font-medium bg-transparent hover:bg-gray-800"
              >
                {spec}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [activeSection, setActiveSection] = useState("about")
  const trainer = getTrainerData(trainerId)

  if (!trainer) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-white text-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Trainer Not Found</h1>
            <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      {trainer.style === "hero" ? (
        <HeroStyle trainer={trainer} />
      ) : trainer.style === "dark" ? (
        <DarkStyle trainer={trainer} />
      ) : (
        <FloatingCardStyle trainer={trainer} activeSection={activeSection} setActiveSection={setActiveSection} />
      )}
    </ThemeProvider>
  )
}
