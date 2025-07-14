"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TempTrainerData {
  id: string
  name: string
  email: string
  specialties: string[]
  bio: string
  location: string
  hourlyRate: number
  experience: string
  certifications: string[]
  availability: string[]
  profileImage?: string
  createdAt: string
  status: "pending" | "active"
}

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainer, setTrainer] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activating, setActivating] = useState(false)

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}${token ? `?token=${token}` : ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch trainer data")
        }

        const data = await response.json()
        setTrainer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTrainer()
    }
  }, [tempId, token])

  const handleActivate = async () => {
    if (!trainer || !token) return

    setActivating(true)
    try {
      const response = await fetch("/api/trainer/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempId,
          token,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to activate trainer profile")
      }

      const result = await response.json()

      // Redirect to the activated profile
      window.location.href = `/marketplace/trainer/${result.trainerId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activation failed")
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading trainer profile...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Trainer profile not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Preview Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This is a preview of your trainer profile.{" "}
            {token
              ? 'Click "Activate Profile" to make it live.'
              : "You need a valid activation token to activate this profile."}
          </AlertDescription>
        </Alert>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={trainer.profileImage || "/placeholder.svg"} alt={trainer.name} />
                <AvatarFallback className="text-lg">
                  {trainer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{trainer.name}</CardTitle>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Preview Mode
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{trainer.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${trainer.hourlyRate}/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{trainer.bio}</p>
              </div>

              <Separator />

              {/* Specialties */}
              <div>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Experience & Certifications */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Experience</h3>
                  <p className="text-gray-700">{trainer.experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <ul className="space-y-1">
                    {trainer.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.availability.map((time, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{time}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activation Section */}
        {token && (
          <Card>
            <CardHeader>
              <CardTitle>Activate Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ready to go live? Activating your profile will make it visible to potential clients and allow you to
                start receiving bookings.
              </p>
              <Button onClick={handleActivate} disabled={activating} className="w-full sm:w-auto">
                {activating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Activate Profile"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Token Message */}
        {!token && (
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To activate this profile, you need to use the activation link sent to your email.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
