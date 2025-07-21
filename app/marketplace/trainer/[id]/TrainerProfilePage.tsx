"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, MapPin, Phone, Mail, Clock, Award, Edit3, Save, X, Eye, EyeOff, AlertCircle } from "lucide-react"

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
    experience: string
    location: string
    specialty: string
  }
  about: {
    title: string
    bio: string
    certifications: string[]
  }
  contact: {
    title: string
    description: string
    email: string
    phone: string
    location: string
  }
  services: Array<{
    name: string
    description: string
    price: string
    duration: string
  }>
}

interface TrainerProfilePageProps {
  trainerId: string
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const searchParams = useSearchParams()
  const [trainer, setTrainer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isLivePreview, setIsLivePreview] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editContent, setEditContent] = useState<TrainerContent | null>(null)

  // Token detection with comprehensive logging
  const token = searchParams?.get("token")
  const debugToken = searchParams?.get("debug_token")
  const isOwner = !!(token || debugToken)

  // Enhanced logging for debugging
  useEffect(() => {
    console.log("=== HEADER VISIBILITY LOGIC ===")
    console.log("isOwner:", isOwner)
    console.log("isLivePreview:", isLivePreview)
    console.log("isEditing:", isEditing)
    console.log("showOwnerControls (isOwner && !isLivePreview):", isOwner && !isLivePreview)
    console.log("showLivePreviewHeader (isOwner && isLivePreview):", isOwner && isLivePreview)

    console.log("=== TOKEN DETECTION ===")
    console.log("Raw token param:", token)
    console.log("Raw debug_token param:", debugToken)
    console.log("Has any token:", !!(token || debugToken))

    console.log("=== OWNER STATUS ===")
    console.log("isOwner set to:", isOwner)
  }, [token, debugToken, isOwner, isLivePreview, isEditing])

  // Generate default content structure
  const generateDefaultContent = (trainerData: any): TrainerContent => {
    console.log("Generating default content for trainer:", trainerData)

    return {
      hero: {
        title: trainerData?.content?.hero?.title || trainerData?.name || "Personal Trainer",
        subtitle: trainerData?.content?.hero?.subtitle || trainerData?.subtitle || "Professional fitness coach",
        description:
          trainerData?.content?.hero?.description ||
          trainerData?.bio ||
          "Transform your fitness journey with personalized training",
        experience: trainerData?.content?.hero?.experience || trainerData?.experience || "1-2 years",
        location: trainerData?.content?.hero?.location || trainerData?.location || "Location",
        specialty: trainerData?.content?.hero?.specialty || trainerData?.specialty || "General Fitness",
      },
      about: {
        title: trainerData?.content?.about?.title || "About Me",
        bio:
          trainerData?.content?.about?.bio ||
          trainerData?.bio ||
          "Professional trainer dedicated to helping you achieve your fitness goals.",
        certifications: trainerData?.content?.about?.certifications || trainerData?.certifications || [],
      },
      contact: {
        title: trainerData?.content?.contact?.title || "Let's Start Your Fitness Journey",
        description:
          trainerData?.content?.contact?.description || "Ready to transform your fitness? Get in touch today!",
        email: trainerData?.content?.contact?.email || trainerData?.email || "trainer@example.com",
        phone: trainerData?.content?.contact?.phone || trainerData?.phone || "+1234567890",
        location: trainerData?.content?.contact?.location || trainerData?.location || "Location",
      },
      services: trainerData?.content?.services || trainerData?.services || [],
    }
  }

  // Fetch trainer data
  useEffect(() => {
    const fetchTrainer = async () => {
      console.log("=== FETCHING TRAINER PROFILE ===")
      console.log("Trainer ID:", trainerId)
      console.log("Has Token:", !!(token || debugToken))

      try {
        const apiToken = token || debugToken
        let apiUrl = `/api/trainer/content/${trainerId}`

        if (apiToken) {
          apiUrl += `?token=${apiToken}`
          console.log("Using token for API call")
        } else {
          console.log("No token - making public API call")
        }

        console.log("API URL:", apiUrl)

        const response = await fetch(apiUrl)
        const data = await response.json()

        console.log("API Response:", data)

        if (data.success) {
          setTrainer(data.trainer)
          console.log("Setting trainer data:", data.trainer)
        } else {
          console.error("API Error:", data.error)
        }
      } catch (error) {
        console.error("Error fetching trainer:", error)
      } finally {
        setLoading(false)
      }
    }

    if (trainerId) {
      fetchTrainer()
    }
  }, [trainerId, token, debugToken])

  // Generate display content
  const displayContent = trainer ? generateDefaultContent(trainer) : null

  // Render decisions logging
  useEffect(() => {
    console.log("=== RENDER DECISIONS ===")
    console.log("showOwnerControls:", isOwner && !isLivePreview)
    console.log("showLivePreviewHeader:", isOwner && isLivePreview)
  }, [isOwner, isLivePreview])

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing && displayContent && !editContent) {
      setEditContent(displayContent)
    }
  }, [isEditing, displayContent, editContent])

  // Handle edit mode toggle
  const handleEditToggle = () => {
    console.log("=== EDIT MODE TOGGLE ===")
    console.log("Current isEditing:", isEditing)
    console.log("Toggling to:", !isEditing)

    if (isEditing) {
      // Exiting edit mode
      if (hasUnsavedChanges) {
        const confirmExit = confirm("You have unsaved changes. Are you sure you want to exit without saving?")
        if (!confirmExit) return
      }
      setIsEditing(false)
      setEditContent(null)
      setHasUnsavedChanges(false)
    } else {
      // Entering edit mode
      if (isLivePreview) {
        setIsLivePreview(false) // Exit live preview when starting to edit
      }
      setIsEditing(true)
      setEditContent(displayContent)
    }
  }

  // Handle live preview toggle
  const handleLivePreviewToggle = () => {
    console.log("=== LIVE PREVIEW TOGGLE ===")
    console.log("Current isLivePreview:", isLivePreview)
    console.log("Toggling to:", !isLivePreview)

    if (!isLivePreview) {
      // Entering live preview
      if (hasUnsavedChanges) {
        const confirmPreview = confirm("You have unsaved changes. Save them before viewing live preview?")
        if (confirmPreview) {
          handleSave()
          return
        }
      }
      if (isEditing) {
        setIsEditing(false) // Exit edit mode when entering live preview
      }
      setIsLivePreview(true)
    } else {
      // Exiting live preview
      setIsLivePreview(false)
    }
  }

  // Handle content updates
  const handleContentUpdate = (section: keyof TrainerContent, field: string, value: any) => {
    if (!editContent) return

    const updatedContent = {
      ...editContent,
      [section]: {
        ...editContent[section],
        [field]: value,
      },
    }

    setEditContent(updatedContent)
    setHasUnsavedChanges(true)
  }

  // Handle save
  const handleSave = async () => {
    if (!editContent || !isOwner) return

    setIsSaving(true)
    console.log("=== SAVING CONTENT ===")
    console.log("Content to save:", editContent)

    try {
      const apiToken = token || debugToken
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
          token: apiToken,
        }),
      })

      const data = await response.json()
      console.log("Save response:", data)

      if (data.success) {
        setTrainer(data.trainer)
        setHasUnsavedChanges(false)
        setIsEditing(false)
        console.log("✅ Content saved successfully")
      } else {
        console.error("❌ Save failed:", data.error)
        alert("Failed to save changes: " + data.error)
      }
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (!trainer || !displayContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <p className="text-gray-600">The trainer profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Content to display (either edit content or display content)
  const currentContent = editContent || displayContent
  const heroContent = currentContent.hero || {}
  const aboutContent = currentContent.about || {}
  const contactContent = currentContent.contact || {}
  const servicesContent = currentContent.services || []

  // Header visibility logic
  const showOwnerControls = isOwner && !isLivePreview
  const showLivePreviewHeader = isOwner && isLivePreview

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Owner Controls Header */}
      {showOwnerControls && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Badge variant={trainer.status === "live" ? "default" : "secondary"}>
                  {trainer.status === "live" ? "Live" : "Draft"}
                </Badge>
                <Badge variant="outline">Owner View</Badge>
                {isEditing && <Badge variant="outline">Editing Mode</Badge>}
                {hasUnsavedChanges && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLivePreviewToggle}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  View Live
                </Button>

                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={handleEditToggle} className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Header */}
      {showLivePreviewHeader && (
        <div className="sticky top-0 z-50 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Live Preview - This is how visitors see your profile</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLivePreviewToggle}
                className="text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Exit Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title" className="text-white text-sm font-medium">
                        Hero Title
                      </Label>
                      <Input
                        id="hero-title"
                        value={heroContent.title || ""}
                        onChange={(e) => handleContentUpdate("hero", "title", e.target.value)}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/70"
                        placeholder="Enter hero title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle" className="text-white text-sm font-medium">
                        Hero Subtitle
                      </Label>
                      <Input
                        id="hero-subtitle"
                        value={heroContent.subtitle || ""}
                        onChange={(e) => handleContentUpdate("hero", "subtitle", e.target.value)}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/70"
                        placeholder="Enter hero subtitle"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-description" className="text-white text-sm font-medium">
                        Hero Description
                      </Label>
                      <Textarea
                        id="hero-description"
                        value={heroContent.description || ""}
                        onChange={(e) => handleContentUpdate("hero", "description", e.target.value)}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder-white/70"
                        placeholder="Enter hero description"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{heroContent.title}</h1>
                    <p className="text-xl mb-6 text-blue-100">{heroContent.subtitle}</p>
                    <p className="text-lg mb-8 text-blue-50">{heroContent.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Clock className="h-4 w-4 mr-1" />
                    {heroContent.experience}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <MapPin className="h-4 w-4 mr-1" />
                    {heroContent.location}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Award className="h-4 w-4 mr-1" />
                    {heroContent.specialty}
                  </Badge>
                </div>

                <div className="text-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Book Free Consultation
                  </Button>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  {isEditing ? (
                    <Input
                      value={aboutContent.title || ""}
                      onChange={(e) => handleContentUpdate("about", "title", e.target.value)}
                      className="text-xl font-semibold border-none p-0 h-auto"
                      placeholder="About section title"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold">{aboutContent.title}</h2>
                  )}
                </div>

                {isEditing ? (
                  <Textarea
                    value={aboutContent.bio || ""}
                    onChange={(e) => handleContentUpdate("about", "bio", e.target.value)}
                    className="w-full"
                    placeholder="Tell your story..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600 mb-6">{aboutContent.bio}</p>
                )}

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  {isEditing ? (
                    <Input
                      value={aboutContent.certifications?.join(", ") || ""}
                      onChange={(e) =>
                        handleContentUpdate("about", "certifications", e.target.value.split(", ").filter(Boolean))
                      }
                      placeholder="Enter certifications separated by commas"
                    />
                  ) : (
                    <div className="space-y-2">
                      {aboutContent.certifications?.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Services Offered</h2>
                </div>

                <div className="space-y-4">
                  {servicesContent.map((service: any, index: number) => (
                    <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-lg">€{service.price}</div>
                        <div className="text-sm text-gray-500">{service.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={contactContent.title || ""}
                      onChange={(e) => handleContentUpdate("contact", "title", e.target.value)}
                      className="text-lg font-semibold border-none p-0 h-auto"
                      placeholder="Contact section title"
                    />
                    <Textarea
                      value={contactContent.description || ""}
                      onChange={(e) => handleContentUpdate("contact", "description", e.target.value)}
                      placeholder="Contact description"
                      rows={2}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">{contactContent.title}</h2>
                    <p className="text-gray-600 text-sm">{contactContent.description}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-blue-600" />
                    {isEditing ? (
                      <Input
                        value={contactContent.email || ""}
                        onChange={(e) => handleContentUpdate("contact", "email", e.target.value)}
                        placeholder="Email address"
                        type="email"
                      />
                    ) : (
                      <span className="text-sm">{contactContent.email}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-blue-600" />
                    {isEditing ? (
                      <Input
                        value={contactContent.phone || ""}
                        onChange={(e) => handleContentUpdate("contact", "phone", e.target.value)}
                        placeholder="Phone number"
                        type="tel"
                      />
                    ) : (
                      <span className="text-sm">{contactContent.phone}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                    {isEditing ? (
                      <Input
                        value={contactContent.location || ""}
                        onChange={(e) => handleContentUpdate("contact", "location", e.target.value)}
                        placeholder="Location"
                      />
                    ) : (
                      <span className="text-sm">{contactContent.location}</span>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">Schedule Consultation</Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{heroContent.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium">{heroContent.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{heroContent.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Development Debug Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-xs max-w-xs">
          <div className="font-semibold mb-2">Debug Info:</div>
          <div>isOwner: {isOwner.toString()}</div>
          <div>isEditing: {isEditing.toString()}</div>
          <div>isLivePreview: {isLivePreview.toString()}</div>
          <div>hasToken: {!!(token || debugToken).toString()}</div>
          <div>showOwnerControls: {showOwnerControls.toString()}</div>
          <div>showLivePreviewHeader: {showLivePreviewHeader.toString()}</div>
        </div>
      )}
    </div>
  )
}
