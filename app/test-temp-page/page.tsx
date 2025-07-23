"use client"

import { useState } from "react"
import TempTrainerPage from "@/app/marketplace/trainer/temp/TempTrainerPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TrainerData } from "@/types/trainer"

export default function TestTempPage() {
  const [currentScenario, setCurrentScenario] = useState<"full" | "minimal" | "expired">("full")
  const [eventLog, setEventLog] = useState<string[]>([])

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)])
  }

  // Mock temp trainer data - Full data scenario
  const fullDataTrainer: TrainerData = {
    id: "temp-123",
    name: "Sarah Johnson",
    title: "Certified Personal Trainer & Nutritionist",
    bio: "Passionate fitness professional with over 8 years of experience helping clients achieve their health and wellness goals. Specializing in strength training, weight loss, and nutrition coaching.",
    location: "Dublin, City Centre",
    profileImage: "/placeholder-user.jpg",
    coverImage: "/placeholder.jpg",
    experience: "8+ years",
    specialties: ["Strength Training", "Weight Loss", "Nutrition Coaching", "HIIT"],
    services: ["Personal Training", "Nutrition Consultation", "Group Classes", "Online Coaching"],
    certifications: ["NASM-CPT", "Precision Nutrition Level 1", "TRX Certified"],
    createdAt: new Date(),
    isActive: false,
  }

  // Mock temp trainer data - Minimal data scenario
  const minimalDataTrainer: TrainerData = {
    id: "temp-456",
    name: "John Smith",
    title: "Personal Trainer",
    bio: "Helping people get fit and healthy.",
    location: "Cork",
    experience: "3 years",
    specialties: ["Fitness"],
    services: ["Training"],
    certifications: ["Certified Trainer"],
    createdAt: new Date(),
    isActive: false,
  }

  // Mock handlers
  const mockHandlers = {
    onActivate: () => {
      logEvent("🚀 Activation button clicked - Routing to payment")
      logEvent("💳 Payment flow initiated with tempId")
    },
  }

  const scenarios = {
    full: {
      trainer: fullDataTrainer,
      timeLeft: 7890, // 2h 11m 30s
      description: "Complete trainer profile with all fields populated",
    },
    minimal: {
      trainer: minimalDataTrainer,
      timeLeft: 1800, // 30 minutes
      description: "Minimal trainer data to test fallback handling",
    },
    expired: {
      trainer: fullDataTrainer,
      timeLeft: 0,
      description: "Expired temp trainer to test expired state",
    },
  }

  const currentData = scenarios[currentScenario]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Controls */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Phase 2: Temp Page Integration Test</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Phase 2 Complete
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Scenario Selection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Test Scenario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <Button
                    key={key}
                    variant={currentScenario === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentScenario(key as any)
                      logEvent(`🔄 Switched to ${key} data scenario`)
                    }}
                    className="w-full justify-start text-xs"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)} Data
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Current Scenario Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">{currentData.description}</p>
                <div className="mt-2 space-y-1">
                  <div className="text-xs">
                    <span className="font-medium">Trainer:</span> {currentData.trainer.name}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Time Left:</span>{" "}
                    {currentData.timeLeft > 0
                      ? `${Math.floor(currentData.timeLeft / 3600)}h ${Math.floor((currentData.timeLeft % 3600) / 60)}m`
                      : "Expired"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Test Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logEvent("🔍 Testing countdown timer functionality")}
                  className="w-full text-xs"
                >
                  Test Timer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logEvent("🎨 Testing visual consistency")}
                  className="w-full text-xs"
                >
                  Check Design
                </Button>
              </CardContent>
            </Card>

            {/* Event Log */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Event Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {eventLog.length === 0 ? (
                    <p className="text-xs text-gray-500">No events yet</p>
                  ) : (
                    eventLog.map((event, index) => (
                      <div key={index} className="text-xs text-gray-600 font-mono">
                        {event}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Temp Trainer Page Component */}
      <TempTrainerPage
        tempTrainer={currentData.trainer}
        tempId={`temp-${currentScenario}-${Date.now()}`}
        timeLeft={currentData.timeLeft}
        {...mockHandlers}
      />
    </div>
  )
}
