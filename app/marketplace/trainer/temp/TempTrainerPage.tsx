"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Mail,
  Phone,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Calendar,
  Award,
  Loader2,
} from "lucide-react"

interface TempTrainerData {
  id: string
  trainerId: string
  name: string
  specialization: string
  bio?: string
  status: "active" | "expired"
  createdAt: any
  expiresAt?: any
}

interface TempTrainerPageProps {
  tempId: string
}

export default function TempTrainerPage({ tempId }: TempTrainerPageProps) {
  const [trainerData, setTrainerData] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/trainer/temp/${tempId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch trainer data: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setTrainerData(data.trainer)
        } else {
          setError(data.error || "Failed to load trainer profile")
        }
      } catch (err) {
        console.error("Error fetching trainer data:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTrainerData()
    }
  }, [tempId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading trainer profile...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !trainerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || "Trainer profile not found or has expired."}
            </AlertDescription>
          </Alert>

          <div className="mt-6 text-center">
            <Button asChild>
              <a href="/marketplace">Browse Other Trainers</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isExpired = trainerData.status === "expired"
  const expiresAt = trainerData.expiresAt ? new Date(trainerData.expiresAt.seconds * 1000) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Alert */}
        <Alert className={`border-2 ${isExpired ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}`}>
          <div className="flex items-center gap-2">
            {isExpired ? <AlertCircle className="h-4 w-4 text-red-600" /> : <Clock className="h-4 w-4 text-blue-600" />}
            <AlertDescription className={isExpired ? "text-red-800" : "text-blue-800"}>
              {isExpired ? (
                "This temporary profile has expired. The trainer may have a permanent profile available."
              ) : (
                <>
                  This is a temporary preview profile.
                  {expiresAt && <> It will expire on {expiresAt.toLocaleDateString()}.</>}
                </>
              )}
            </AlertDescription>
          </div>
        </Alert>

        {/* Main Profile Card */}
        <Card className="overflow-hidden">
          <div className="trainer-profile-hero p-8 text-white">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{trainerData.name}</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
                  {trainerData.specialization}
                </Badge>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Certified Trainer</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Available for Sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            {trainerData.bio && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">About Me</h2>
                <p className="text-gray-600 leading-relaxed">{trainerData.bio}</p>
              </div>
            )}

            <Separator className="my-8" />

            {/* Specialization Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Specialization</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-blue-900">{trainerData.specialization}</h3>
                </div>
                <p className="text-blue-700">
                  Specialized training programs designed to help you achieve your{" "}
                  {trainerData.specialization.toLowerCase()} goals with professional guidance and personalized
                  attention.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Interested in working with {trainerData.name}? This is a temporary profile preview. Once approved,
                  full contact information and booking options will be available.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email Available After Approval
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone Available After Approval
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Booking Available After Approval
                  </Badge>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to Start Your Fitness Journey?</h3>
              <p className="mb-4 text-blue-100">
                {trainerData.name} is currently under review. Check back soon or browse other available trainers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" asChild>
                  <a href="/marketplace" className="flex items-center gap-2">
                    Browse All Trainers
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Save Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submission Status</span>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50">
                    Under Review
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Type</span>
                  <Badge variant="outline">Temporary Preview</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(trainerData.createdAt.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600">Profile review in progress</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="text-gray-600">Email confirmation upon approval</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="text-gray-600">Full profile goes live</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <span className="text-gray-600">Start accepting clients</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
