"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Phone,
  Mail,
  Globe,
} from "lucide-react"
import { toast } from "react-hot-toast"

interface TempTrainerData {
  id: string
  name: string
  email: string
  specialties: string[]
  bio: string
  experience: string
  certifications: string[]
  location: string
  pricing: {
    sessionRate: number
    packageDeals: string[]
  }
  availability: string[]
  contactInfo: {
    phone?: string
    website?: string
    social?: {
      instagram?: string
      facebook?: string
      linkedin?: string
    }
  }
  profileImage?: string
  createdAt: string
  status: "pending" | "active" | "expired"
  activationToken?: string
}

interface TempTrainerPageProps {
  tempId: string
  token?: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
  const [trainerData, setTrainerData] = useState<TempTrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activating, setActivating] = useState(false)

  useEffect(() => {
    fetchTempTrainer()
  }, [tempId, token])

  const fetchTempTrainer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/temp/${tempId}${token ? `?token=${encodeURIComponent(token)}` : ""}`)

      if (!response.ok) {
        throw new Error("Trainer profile not found")
      }

      const result = await response.json()

      // The API returns data under result.trainer, not directly
      if (result.success && result.trainer) {
        // Map the API response to match our component interface
        const mappedData: TempTrainerData = {
          id: result.trainer.id,
          name: result.trainer.fullName || "Unknown Trainer", // API uses fullName, component expects name
          email: result.trainer.email || "",
          specialties: Array.isArray(result.trainer.specialties) ? result.trainer.specialties : [],
          bio: result.trainer.bio || "",
          experience: result.trainer.experience || "",
          certifications: Array.isArray(result.trainer.certifications) ? result.trainer.certifications : [],
          location: result.trainer.location || "",
          pricing: {
            sessionRate: 80, // Default value since API doesn't have this structure
            packageDeals: [],
          },
          availability: [], // Default empty array
          contactInfo: {
            phone: result.trainer.phone || "",
            website: "",
            social: {},
          },
          profileImage: "",
          createdAt: new Date().toISOString(), // Default to current date
          status: result.trainer.isActive ? "active" : "pending",
          activationToken: result.trainer.sessionToken,
        }
        setTrainerData(mappedData)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trainer profile")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateProfile = async () => {
    if (!token || !trainerData) {
      toast.error("Invalid activation token")
      return
    }

    try {
      setActivating(true)
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
        throw new Error("Failed to activate profile")
      }

      const result = await response.json()
      toast.success("Profile activated successfully!")

      // Redirect to the live trainer profile
      window.location.href = `/marketplace/trainer/${result.trainerId}`
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Activation failed")
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 text-lg">Loading your trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error || !trainerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Profile Not Found</h2>
              <p className="text-gray-600 mb-6">
                {error || "The trainer profile you're looking for doesn't exist or has expired."}
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <a href="/marketplace">Browse Trainers</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = trainerData.status === "expired"
  const isActive = trainerData.status === "active"
  const canActivate = token && trainerData?.activationToken === token && !isActive && !isExpired

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Preview Alert */}
          <Alert className="mb-8 bg-white/10 border-white/20 text-white">
            <AlertDescription className="flex items-center gap-2">
              {isActive ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  This profile is now live and active on the marketplace.
                </>
              ) : isExpired ? (
                <>
                  <XCircle className="h-5 w-5 text-red-300" />
                  This preview link has expired. Please create a new trainer profile.
                </>
              ) : (
                <>
                  <Loader2 className="h-5 w-5 text-blue-300" />
                  This is a preview of your trainer profile. Use the activation button below to make it live.
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Trainer Header */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={trainerData.profileImage || "/placeholder.svg"} alt={trainerData.name} />
              <AvatarFallback className="text-3xl bg-white text-orange-500">
                {trainerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <h1 className="text-4xl font-bold">{trainerData.name}</h1>
                <Badge variant={isActive ? "default" : "secondary"} className="text-sm">
                  {trainerData.status}
                </Badge>
              </div>

              {trainerData.location && (
                <div className="flex items-center gap-2 text-white/90 mb-4 justify-center md:justify-start">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{trainerData.location}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(trainerData.specialties || []).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-white/10 border-white/30 text-white">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-orange-500" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{trainerData.bio}</p>
              </CardContent>
            </Card>

            {/* Experience & Certifications */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{trainerData.experience}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(trainerData.certifications || []).map((cert, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="h-2 w-2 bg-orange-500 rounded-full" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="shadow-lg border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">${trainerData.pricing.sessionRate}</div>
                  <div className="text-gray-600">per session</div>

                  {trainerData.pricing.packageDeals.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Package Deals:</p>
                      <ul className="space-y-1">
                        {trainerData.pricing.packageDeals.map((deal, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {deal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trainerData.contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{trainerData.contactInfo.phone}</span>
                  </div>
                )}

                {trainerData.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{trainerData.email}</span>
                  </div>
                )}

                {trainerData.contactInfo.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={trainerData.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                    >
                      {trainerData.contactInfo.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            {trainerData.availability.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trainerData.availability.map((time, index) => (
                      <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Activation Section */}
        {canActivate && (
          <Card className="mt-12 shadow-xl border-orange-200">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Ready to Go Live?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Activate your profile to make it visible to clients on the marketplace and start getting bookings.
                </p>
                <Button
                  onClick={handleActivateProfile}
                  disabled={activating}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                >
                  {activating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Activating Profile...
                    </>
                  ) : (
                    "Activate Profile"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Profile created on {new Date(trainerData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
