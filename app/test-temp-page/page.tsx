"use client"

import { useState } from "react"
import TempTrainerPage from "@/app/marketplace/trainer/temp/TempTrainerPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, MapPin } from "lucide-react"

// Mock temp trainer data for testing
const mockTempTrainer = {
  id: "temp_test_123",
  fullName: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+353 87 123 4567",
  location: "Dublin, City Centre",
  specialty: "Strength & Conditioning",
  experience: "7+ years",
  bio: "Passionate fitness trainer with over 7 years of experience helping clients achieve their strength and conditioning goals. I specialize in functional movement, Olympic lifting, and creating sustainable fitness habits that last a lifetime.\n\nMy approach combines evidence-based training methods with personalized attention to ensure every client gets the results they're looking for. Whether you're a beginner or an experienced athlete, I'll help you reach your full potential.",
  certifications: "NASM-CPT, CSCS, Precision Nutrition Level 1, Olympic Weightlifting Certification",
  services: [
    "Personal Training Sessions",
    "Strength & Conditioning Programs",
    "Olympic Weightlifting Coaching",
    "Nutrition Guidance",
    "Movement Assessment",
  ],
  status: "temp",
  createdAt: "2024-01-15T10:00:00Z",
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  sessionToken: "test_token_123",
}

const mockMinimalTrainer = {
  id: "temp_minimal_456",
  fullName: "Mike Chen",
  email: "mike@example.com",
  location: "Cork",
  specialty: "Fitness Training",
  experience: "3 years",
  bio: "",
  services: [],
  status: "temp",
  createdAt: "2024-01-15T10:00:00Z",
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
}

const mockExpiredTrainer = {
  id: "temp_expired_789",
  fullName: "Lisa Rodriguez",
  email: "lisa@example.com",
  location: "Galway, City",
  specialty: "Yoga & Pilates",
  experience: "4 years",
  bio: "Certified yoga instructor and Pilates specialist.",
  services: ["Yoga Classes", "Pilates Sessions"],
  status: "temp",
  createdAt: "2024-01-14T10:00:00Z",
  expiresAt: "2024-01-14T11:00:00Z", // Already expired
}

export default function TestTempPage() {
  const [selectedTrainer, setSelectedTrainer] = useState(mockTempTrainer)
  const [eventLog, setEventLog] = useState<string[]>([])

  const logEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEventLog((prev) => [`[${timestamp}] ${event}`, ...prev.slice(0, 9)])
  }

  const testTrainers = [
    { name: "Full Data Trainer", data: mockTempTrainer, description: "Complete trainer profile with all fields" },
    { name: "Minimal Data Trainer", data: mockMinimalTrainer, description: "Basic trainer info to test fallbacks" },
    { name: "Expired Trainer", data: mockExpiredTrainer, description: "Expired preview to test expired state" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Phase 2 Testing: Temp Page Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trainer Selection */}
              <div>
                <h3 className="font-semibold mb-3">Test Scenarios</h3>
                <div className="space-y-2">
                  {testTrainers.map((trainer, index) => (
                    <Button
                      key={index}
                      variant={selectedTrainer.id === trainer.data.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedTrainer(trainer.data)
                        logEvent(`Switched to: ${trainer.name}`)
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {trainer.name}
                    </Button>
                  ))}
                </div>

                {/* Current Trainer Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Current Test Data:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedTrainer.fullName}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedTrainer.location}</span>
                    </div>
                    <div>Specialty: {selectedTrainer.specialty}</div>
                    <div>Services: {selectedTrainer.services.length}</div>
                    <div>Bio Length: {selectedTrainer.bio.length} chars</div>
                  </div>
                </div>
              </div>

              {/* Event Log */}
              <div>
                <h3 className="font-semibold mb-3">Event Log</h3>
                <div className="bg-black text-green-400 p-3 rounded-lg font-mono text-xs h-48 overflow-y-auto">
                  {eventLog.length === 0 ? (
                    <div className="text-gray-500">No events logged yet...</div>
                  ) : (
                    eventLog.map((event, index) => <div key={index}>{event}</div>)
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => setEventLog([])}>
                  Clear Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temp Trainer Page Component */}
        <TempTrainerPage trainer={selectedTrainer} token="test_token_123" />
      </div>
    </div>
  )
}
