"use client"

import { useState } from "react"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Test data
const mockTrainerData = {
  id: "test-trainer-123",
  fullName: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+1 (555) 123-4567",
  city: "Amsterdam",
  district: "Centrum",
  specialty: "Strength Training & Nutrition",
  bio: "Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals. Specializing in strength training, weight loss, and nutrition coaching.",
  certifications: "NASM-CPT, Precision Nutrition Level 1, TRX Certified",
  services: ["Personal Training", "Nutrition Coaching", "Group Classes"],
  profileImage: "/placeholder-user.jpg",
  status: "active",
  isActive: true,
  isPaid: true,
}

const mockContent = {
  hero: {
    title: "Transform Your Body with Sarah Johnson",
    subtitle: "Certified Personal Trainer & Nutrition Coach",
    description:
      "Get personalized training programs and nutrition guidance to reach your fitness goals faster than ever before.",
  },
  about: {
    title: "About Sarah",
    bio: "With over 5 years of experience in the fitness industry, I've helped hundreds of clients transform their lives through proper training and nutrition. My approach combines evidence-based methods with personalized attention to ensure you get the results you deserve.",
  },
  contact: {
    title: "Let's Start Your Journey",
    description: "Ready to transform your fitness? Get in touch to schedule your first session.",
    phone: "+1 (555) 123-4567",
    email: "sarah@example.com",
    location: "Amsterdam, Centrum",
  },
  services: [
    {
      id: "personal-training",
      title: "Personal Training",
      description: "One-on-one customized workout sessions tailored to your goals",
      price: 80,
      duration: "60 minutes",
      featured: true,
    },
    {
      id: "nutrition-coaching",
      title: "Nutrition Coaching",
      description: "Personalized meal plans and nutrition guidance",
      price: 60,
      duration: "45 minutes",
      featured: false,
    },
    {
      id: "group-classes",
      title: "Group Classes",
      description: "Small group training sessions for motivation and community",
      price: 35,
      duration: "45 minutes",
      featured: false,
    },
  ],
}

const minimalTrainerData = {
  id: "minimal-trainer",
  fullName: "John Doe",
  email: "john@example.com",
  specialty: "General Fitness",
  services: [],
  status: "temp",
}

export default function TestSharedComponentPage() {
  const [currentTest, setCurrentTest] = useState("live-full")
  const [eventLog, setEventLog] = useState<string[]>([])

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)])
  }

  const testScenarios = {
    "live-full": {
      name: "Live Mode - Full Data",
      component: (
        <TrainerProfileDisplay
          trainer={mockTrainerData}
          content={mockContent}
          mode="live"
          isEditable={true}
          onBookConsultation={() => logEvent("Book consultation clicked (Live)")}
          onScheduleSession={() => logEvent("Schedule session clicked (Live)")}
          onSendMessage={() => logEvent("Send message clicked (Live)")}
          onEdit={() => logEvent("Edit profile clicked (Live)")}
        />
      ),
    },
    "temp-preview": {
      name: "Temp Mode - Preview",
      component: (
        <TrainerProfileDisplay
          trainer={mockTrainerData}
          content={mockContent}
          mode="temp"
          timeLeft="2 hours 15 minutes"
          activationPrice="€70"
          onBookConsultation={() => logEvent("Book consultation clicked (Temp)")}
          onActivate={() => logEvent("Activate profile clicked (Temp)")}
        />
      ),
    },
    "minimal-data": {
      name: "Minimal Data - Fallbacks",
      component: (
        <TrainerProfileDisplay
          trainer={minimalTrainerData}
          mode="temp"
          timeLeft="1 hour 30 minutes"
          onBookConsultation={() => logEvent("Book consultation clicked (Minimal)")}
          onActivate={() => logEvent("Activate profile clicked (Minimal)")}
        />
      ),
    },
    "temp-expired": {
      name: "Temp Mode - Expired",
      component: (
        <TrainerProfileDisplay
          trainer={mockTrainerData}
          content={mockContent}
          mode="temp"
          isExpired={true}
          onBookConsultation={() => logEvent("Book consultation clicked (Expired)")}
        />
      ),
    },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Test Controls */}
      <div className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Phase 1 Test: Shared TrainerProfileDisplay Component</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(testScenarios).map(([key, scenario]) => (
              <Button
                key={key}
                variant={currentTest === key ? "default" : "outline"}
                onClick={() => setCurrentTest(key)}
                className="text-sm"
              >
                {scenario.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Test</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-2">
                  {testScenarios[currentTest as keyof typeof testScenarios].name}
                </Badge>
                <p className="text-sm text-gray-600">
                  Testing the shared component with different data and mode configurations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {eventLog.length === 0 ? (
                    <p className="text-sm text-gray-500">No events yet. Click buttons to test interactions.</p>
                  ) : (
                    eventLog.map((event, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                        {event}
                      </div>
                    ))
                  )}
                </div>
                {eventLog.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setEventLog([])} className="mt-2 text-xs">
                    Clear Log
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Component Display */}
      <div>{testScenarios[currentTest as keyof typeof testScenarios].component}</div>
    </div>
  )
}
