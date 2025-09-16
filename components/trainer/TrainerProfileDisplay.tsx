"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"
import {
  MapPin,
  Users,
  Dumbbell,
  Award,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  MessageCircle,
  Plus,
  Trash2,
  Camera,
} from "lucide-react"

// Unified interfaces
export interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  city?: string
  district?: string
  specialty: string
  bio?: string
  certifications?: string
  services: string[]
  profileImage?: string
  status: string
  isActive?: boolean
  isPaid?: boolean
}

export interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    bio: string
  }
  contact: {
    title: string
    description: string
    phone: string
    email: string
    location: string
  }
  services: TrainerService[]
}

export interface TrainerService {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

export type DisplayMode = "temp-edit" | "live-edit" | "public"

export interface TrainerProfileDisplayProps {
  trainer: TrainerData
  content?: TrainerContent
  editingContent?: TrainerContent
  mode: DisplayMode

  // Global edit state
  isEditing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  onContentChange?: (content: TrainerContent) => void
  hasUnsavedChanges?: boolean
  saving?: boolean

  // Action callbacks
  onBookConsultation?: () => void
  onScheduleSession?: () => void
  onSendMessage?: () => void
  onActivate?: () => void

  // Temp mode specific
  timeLeft?: string
  isExpired?: boolean
  activationPrice?: string
}

export default function TrainerProfileDisplay({
  trainer,
  content,
  editingContent,
  mode,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onContentChange,
  hasUnsavedChanges = false,
  saving = false,
  onBookConsultation,
  onScheduleSession,
  onSendMessage,
  onActivate,
  timeLeft,
  isExpired = false,
  activationPrice = "€70",
}: TrainerProfileDisplayProps) {
  const isPublic = mode === "public"
  const currentContent = isEditing ? editingContent : content

  // Safe access to content with fallbacks
  const heroContent = currentContent?.hero || {
    title: `Transform Your Fitness with ${trainer.fullName}`,
    subtitle: `Professional ${trainer.specialty} trainer`,
    description: trainer.bio || "Professional fitness training services tailored to your goals.",
  }

  const aboutContent = currentContent?.about || {
    title: "About Me",
    bio: trainer.bio || "Professional trainer dedicated to helping clients achieve their fitness goals.",
  }

  const contactContent = currentContent?.contact || {
    title: mode === "temp-edit" ? "Let's Start Your Fitness Journey" : "Contact",
    description:
      mode === "temp-edit"
        ? "Get in touch to schedule your consultation"
        : "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
    phone: trainer.phone || "",
    email: trainer.email,
    location: trainer.city && trainer.district ? `${trainer.city}, ${trainer.district}` : trainer.city || "Location",
  }

  const servicesContent = Array.isArray(currentContent?.services) ? currentContent.services : []

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle content updates
  const updateContent = (section: string, field: string, value: any) => {
    if (!editingContent || !onContentChange) return

    const updatedContent = { ...editingContent }

    if (section === "hero" || section === "about" || section === "contact") {
      updatedContent[section] = {
        ...updatedContent[section],
        [field]: value,
      }
    } else if (section === "services") {
      const [index, serviceField] = field.split(".")
      const serviceIndex = Number.parseInt(index)

      if (updatedContent.services[serviceIndex]) {
        updatedContent.services[serviceIndex] = {
          ...updatedContent.services[serviceIndex],
          [serviceField]: serviceField === "price" ? Number.parseFloat(value) || 0 : value,
        }
      }
    }

    onContentChange(updatedContent)
  }

  // Add new service
  const addService = () => {
    if (!editingContent || !onContentChange) return

    const newService: TrainerService = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: 60,
      duration: "60 minutes",
      featured: false,
    }

    const updatedContent = {
      ...editingContent,
      services: [...editingContent.services, newService],
    }

    onContentChange(updatedContent)
  }

  // Remove service
  const removeService = (index: number) => {
    if (!editingContent || !onContentChange) return

    const updatedContent = {
      ...editingContent,
      services: editingContent.services.filter((_, i) => i !== index),
    }

    onContentChange(updatedContent)
  }

  const [uploadingImage, setUploadingImage] = useState(false)
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lastUploadTime, setLastUploadTime] = useState(0)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const now = Date.now()
    if (uploadingImage || now - lastUploadTime < 2000) {
      console.log("[v0] Upload blocked - too frequent or already uploading")
      return
    }

    setUploadingImage(true)
    setLastUploadTime(now)

    try {
      console.log("[v0] Starting image upload", { fileName: file.name, size: file.size })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("trainerId", trainer.id)

      const uploadResponse = await fetch("/api/trainer/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const { url } = await uploadResponse.json()
      console.log("[v0] Upload successful, updating database", { url })

      const updateResponse = await fetch("/api/trainer/update-profile-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainerId: trainer.id,
          profileImage: url,
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json()
        throw new Error(errorData.error || "Failed to update profile image")
      }

      console.log("[v0] Database updated successfully")

      const timestamp = Date.now()
      const cacheBustedUrl = `${url}?cb=${timestamp}`
      setTempProfileImage(cacheBustedUrl)

      // Update the trainer object directly to persist the change
      trainer.profileImage = url

      console.log("[v0] Image upload complete", { cacheBustedUrl, originalUrl: url })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("[v0] Image upload failed:", error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section - Shared Design with Purple Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 mb-6">
            {/* Profile Image - Left aligned and bigger */}
            <div className="relative flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 bg-white/10">
                <img
                  src={
                    tempProfileImage ||
                    (trainer.profileImage
                      ? `${trainer.profileImage}?cb=${Date.now()}&v=${Math.random()}`
                      : "/placeholder.svg")
                  }
                  alt={trainer.fullName}
                  className="w-full h-full object-cover"
                  key={`profile-${trainer.id}-${tempProfileImage || trainer.profileImage}-${Date.now()}`}
                  onLoad={() => console.log("[v0] Image loaded successfully")}
                  onError={() => console.log("[v0] Image failed to load")}
                />
                {!tempProfileImage && !trainer.profileImage && (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-white/20 text-white">
                    {getInitials(trainer.fullName)}
                  </div>
                )}
              </div>

              {isEditing && (
                <>
                  <button
                    onClick={triggerImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Content - Right side */}
            <div className="flex-1 md:text-left">
              {/* Hero Title */}
              {isEditing ? (
                <div className="mb-4">
                  <Input
                    value={heroContent.title}
                    onChange={(e) => updateContent("hero", "title", e.target.value)}
                    className="text-3xl md:text-4xl font-bold text-white bg-transparent border-white/30 placeholder:text-white/70 focus:border-white/60"
                    placeholder="Enter hero title"
                  />
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{heroContent.title}</h1>
              )}

              {/* Hero Subtitle */}
              {isEditing ? (
                <div className="mb-6">
                  <Input
                    value={heroContent.subtitle}
                    onChange={(e) => updateContent("hero", "subtitle", e.target.value)}
                    className="text-lg bg-transparent border-white/30 placeholder:text-white/70 focus:border-white/60 text-white"
                    placeholder="Enter subtitle"
                  />
                </div>
              ) : (
                <p className="text-lg mb-6 opacity-90">{heroContent.subtitle}</p>
              )}

              {/* Hero Description */}
              {isEditing ? (
                <div className="mb-6">
                  <Textarea
                    value={heroContent.description}
                    onChange={(e) => updateContent("hero", "description", e.target.value)}
                    className="text-base bg-transparent border-white/30 placeholder:text-white/70 focus:border-white/60 text-white min-h-[80px] resize-none"
                    placeholder="Enter description"
                  />
                </div>
              ) : (
                <p className="text-base mb-6 opacity-80">{heroContent.description}</p>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                <Badge variant="secondary" className="text-blue-600 bg-white/90">
                  <Award className="h-4 w-4 mr-1" />
                  {trainer.specialty}
                </Badge>
                <Badge variant="secondary" className="text-blue-600 bg-white/90">
                  <MapPin className="h-4 w-4 mr-1" />
                  {contactContent.location}
                </Badge>
                {trainer.certifications && (
                  <Badge variant="secondary" className="text-blue-600 bg-white/90">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Certified
                  </Badge>
                )}
              </div>

              {/* CTA Button */}
              <div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-blue-600 bg-white hover:bg-gray-100"
                  onClick={onBookConsultation}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {isEditing ? (
                  <Input
                    value={aboutContent.title}
                    onChange={(e) => updateContent("about", "title", e.target.value)}
                    className="bg-transparent border-gray-200 focus:border-blue-500 font-semibold text-lg"
                    placeholder="About section title"
                  />
                ) : (
                  aboutContent.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="mb-4">
                  <Textarea
                    value={aboutContent.bio}
                    onChange={(e) => updateContent("about", "bio", e.target.value)}
                    className="bg-transparent border-gray-200 focus:border-blue-500 min-h-[120px] text-gray-600 leading-relaxed resize-none"
                    placeholder="Tell your story..."
                  />
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
                  {aboutContent.bio}
                </p>
              )}

              {trainer.certifications && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Certifications
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {isEditing ? (
                      <Textarea
                        value={trainer.certifications}
                        onChange={(e) => updateContent("trainer", "certifications", e.target.value)}
                        className="bg-transparent border-gray-200 focus:border-blue-500 text-gray-700 min-h-[60px] resize-none"
                        placeholder="List your certifications"
                      />
                    ) : (
                      <p className="text-gray-700">{trainer.certifications}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Services Offered
                </div>
                {isEditing && (
                  <Button onClick={addService} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicesContent.length > 0 ? (
                  servicesContent.map((service, index) => (
                    <div
                      key={service.id || index}
                      className={`border border-gray-200 rounded-lg p-4 transition-shadow ${
                        isEditing ? "bg-gray-50/50" : "hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {isEditing ? (
                            <Input
                              value={service.title}
                              onChange={(e) => updateContent("services", `${index}.title`, e.target.value)}
                              className="bg-transparent border-gray-200 focus:border-blue-500 font-semibold"
                              placeholder="Service title"
                            />
                          ) : (
                            <h3 className="font-semibold">{service.title}</h3>
                          )}
                          {service.featured && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Featured
                            </Badge>
                          )}
                          {isEditing && (
                            <Button
                              onClick={() => removeService(index)}
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-blue-600 flex items-center">
                            €
                            {isEditing ? (
                              <Input
                                type="number"
                                value={service.price}
                                onChange={(e) => updateContent("services", `${index}.price`, e.target.value)}
                                className="bg-transparent border-gray-200 focus:border-blue-500 w-20 ml-1 text-center"
                                placeholder="Price"
                              />
                            ) : (
                              service.price
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {isEditing ? (
                              <Input
                                value={service.duration}
                                onChange={(e) => updateContent("services", `${index}.duration`, e.target.value)}
                                className="bg-transparent border-gray-200 focus:border-blue-500 text-sm text-center"
                                placeholder="Duration"
                              />
                            ) : (
                              service.duration
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditing ? (
                        <Textarea
                          value={service.description}
                          onChange={(e) => updateContent("services", `${index}.description`, e.target.value)}
                          className="bg-transparent border-gray-200 focus:border-blue-500 text-gray-600 text-sm mb-3 min-h-[60px] resize-none"
                          placeholder="Service description"
                        />
                      ) : (
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      )}
                      {!isPublic && !isEditing && (
                        <Button className="w-full bg-transparent" variant="outline" onClick={onScheduleSession}>
                          Book This Service
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-medium mb-2">Services Coming Soon</h3>
                    <p className="text-sm">This trainer is setting up their service offerings.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? (
                  <Input
                    value={contactContent.title}
                    onChange={(e) => updateContent("contact", "title", e.target.value)}
                    className="bg-transparent border-gray-200 focus:border-blue-500 font-semibold"
                    placeholder="Contact section title"
                  />
                ) : (
                  contactContent.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={contactContent.description}
                  onChange={(e) => updateContent("contact", "description", e.target.value)}
                  className="bg-transparent border-gray-200 focus:border-blue-500 text-gray-600 text-sm min-h-[80px] resize-none"
                  placeholder="Contact description"
                />
              ) : (
                <p className="text-gray-600 text-sm">{contactContent.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{contactContent.email}</span>
                </div>

                {contactContent.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{contactContent.phone}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{contactContent.location}</span>
                </div>
              </div>

              <Separator />

              {/* Mode-specific contact buttons */}
              {!isPublic && !isEditing && (
                <div className="space-y-2">
                  {mode === "temp-edit" ? (
                    <Button
                      className="w-full"
                      style={{ backgroundColor: "#D2FF28", color: "black" }}
                      onClick={onBookConsultation}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Consultation
                    </Button>
                  ) : (
                    <>
                      <Button className="w-full" onClick={onScheduleSession}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Session
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={onSendMessage}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty</span>
                <span className="font-semibold">{trainer.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold">{contactContent.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Services</span>
                <span className="font-semibold">{servicesContent.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge variant={mode === "public" ? "default" : "secondary"}>
                  {mode === "public" ? "Active" : mode === "temp-edit" ? "Preview" : "Live"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Temp Mode - Activation CTA */}
          {mode === "temp-edit" && !isExpired && !isEditing && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Ready to Go Live?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Activate your trainer profile and start accepting bookings today.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={onActivate}
                  >
                    Activate Profile - {activationPrice}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expired State */}
          {mode === "temp-edit" && isExpired && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-red-900 mb-2">Preview Expired</h3>
                  <p className="text-sm text-red-600 mb-4">
                    This preview has expired. Please create a new trainer profile.
                  </p>
                  <Button variant="outline" className="w-full border-red-300 text-red-700 bg-transparent">
                    Create New Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
