"use client"

import { useState } from "react"
import TempTrainerPage from "@/app/marketplace/trainer/temp/TempTrainerPage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock temp trainer data for testing
const mockTempTrainers = {
  fullData: {
    tempId: "temp-123-full",
    fullName: "Alex Rodriguez",
    email: "alex@example.com",
    phone: "+1 (555) 987-6543",
    city: "Barcelona, Eixample",
    specialty: "CrossFit & Functional Training",
    bio: "Certified CrossFit Level 2 trainer with 8+ years of experience. I specialize in functional movement, Olympic lifting, and metabolic conditioning. My approach focuses on building strength, endurance, and confidence through challenging but achievable workouts.",
    certifications: "CrossFit Level 2, USAW Sports Performance Coach, FMS Level 2",
    services: ["CrossFit Training", "Olympic Lifting", "Functional Movement", "Nutrition Coaching"],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 minutes from now
    isExpired: false,
  },

  minimalData: {
    tempId: "temp-456-minimal",
    fullName: "Maria Santos",
    email: "maria@example.com",
    specialty: "Yoga",
    services: ["Hatha Yoga"],
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    expiresAt: new Date(Date.now() + 105 * 60 * 1000).toISOString(), // 105 minutes from now
    isExpired: false,
  },

  expiredData: {
    tempId: "temp-789-expired",
    fullName: "John Smith",
    email: "john@example.com",
    specialty: "Strength Training",
    services: ["Personal Training", "Powerlifting"],
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(), // 150 minutes ago
    expiresAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago (expired)
    isExpired: true,
  },
}

export default function TestTempPagePage() {
  const [currentTest, setCurrentTest] = useState("full-data")
  const [eventLog, setEventLog] = useState<string[]>([])

  const logEvent = (event: string) => {
    setEventLog((prev) => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)])
  }

  // Mock API responses
  const mockApiResponse = (tempId: string) => {
    const trainer = Object.values(mockTempTrainers).find((t) => t.tempId === tempId)

    if (!trainer) {
      return {
        success: false,
        error: "Trainer preview not found",
      }
    }

    return {
      success: true,
      trainer: trainer,
    }
  }

  // Override fetch for testing (without Jest dependency)
  const originalFetch = global.fetch
  if (typeof window !== "undefined") {
    global.fetch = ((url: string) => {
      const tempId = url.split("/").pop()
      const response = mockApiResponse(tempId || "")

      logEvent(`API call: ${url}`)

      return Promise.resolve({
        ok: response.success,
        json: () => Promise.resolve(response),
      } as Response)
    }) as typeof fetch
  }

  const testScenarios = {
    "full-data": {
      name: "Full Data Trainer",
      description: "Complete trainer profile with all fields populated",
      tempId: "temp-123-full",
    },
    "minimal-data": {
      name: "Minimal Data Trainer",
      description: "Basic trainer profile testing fallback handling",
      tempId: "temp-456-minimal",
    },
    "expired-trainer": {
      name: "Expired Trainer",
      description: "Expired preview testing error state handling",
      tempId: "temp-789-expired",
    },
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Test Controls */}
      <div className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Phase 2 Test: Temp Page Integration</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(testScenarios).map(([key, scenario]) => (
              <Button
                key={key}
                variant={currentTest === key ? "default" : "outline"}
                onClick={() => {
                  setCurrentTest(key)
                  logEvent(`Switched to test: ${scenario.name}`)
                }}
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
                  {testScenarios[currentTest as keyof typeof testScenarios].description}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Temp ID:</strong> {testScenarios[currentTest as keyof typeof testScenarios].tempId}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {eventLog.length === 0 ? (
                    <p className="text-sm text-gray-500">No events yet. Interact with the temp page to see logs.</p>
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

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Testing Features:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Real-time countdown timer (full & minimal data scenarios)</li>
              <li>• Data transformation from temp format to display format</li>
              <li>• Activation CTAs and preview mode banner</li>
              <li>• Fallback handling for missing data fields</li>
              <li>• Expired state handling and error messages</li>
              <li>• Shared component integration with temp-specific features</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Component Display */}
      <div>
        <TempTrainerPage tempId={testScenarios[currentTest as keyof typeof testScenarios].tempId} />
      </div>
    </div>
  )
}
