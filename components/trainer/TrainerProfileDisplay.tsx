"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Edit2,
  Save,
  X,
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
  mode: DisplayMode

  // Editing callbacks
  onContentUpdate?: (section: string, field: string, value: any) => void
  onSave?: () => void
  onCancel?: () => void
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

interface EditableFieldProps {
  value: string
  onSave: (value: string) => void
  multiline?: boolean
  placeholder?: string
  className?: string
}

function EditableField({ value, onSave, multiline = false, placeholder, className = "" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className={`group relative ${className}`}>
        <div className="pr-8">
          {multiline ? (
            <p className="whitespace-pre-line">{value || placeholder}</p>
          ) : (
            <span>{value || placeholder}</span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {multiline ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px]"
        />
      ) : (
        <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={placeholder} />
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default function TrainerProfileDisplay({
  trainer,
  content,
  mode,
  onContentUpdate,
  onSave,
  onCancel,
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
  const isEditable = mode === "temp-edit" || mode === "live-edit"
  const isPublic = mode === "public"

  // Safe access to content with fallbacks
  const heroContent = content?.hero || {
    title: `Transform Your Fitness with ${trainer.fullName}`,
    subtitle: `Professional ${trainer.specialty} trainer`,
    description: trainer.bio || "Professional fitness training services tailored to your goals.",
  }

  const aboutContent = content?.about || {
    title: "About Me",
    bio: trainer.bio || "Professional trainer dedicated to helping clients achieve their fitness goals.",
  }

  const contactContent = content?.contact || {
    title: mode === "temp-edit" ? "Let's Start Your Fitness Journey" : "Contact",
    description:
      mode === "temp-edit"
        ? "Get in touch to schedule your consultation"
        : "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
    phone: trainer.phone || "",
    email: trainer.email,
    location: trainer.city && trainer.district ? `${trainer.city}, ${trainer.district}` : trainer.city || "Location",
  }

  const servicesContent = Array.isArray(content?.services) ? content.services : []

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFieldUpdate = (section: string, field: string, value: string) => {
    if (onContentUpdate) {
      onContentUpdate(section, field, value)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section - Shared Design with Purple Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          <div className="mb-6">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white/20">
              <AvatarImage src={trainer.profileImage || "/placeholder.svg"} alt={trainer.fullName} />
              <AvatarFallback className="text-2xl bg-white/20 text-white">
                {getInitials(trainer.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Hero Title */}
          {isEditable ? (
            <div className="mb-4">
              <EditableField
                value={heroContent.title}
                onSave={(value) => handleFieldUpdate("hero", "title", value)}
                placeholder="Enter hero title"
                className="text-4xl md:text-5xl font-bold text-white"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroContent.title}</h1>
          )}

          {/* Hero Subtitle */}
          {isEditable ? (
            <div className="mb-6">
              <EditableField
                value={heroContent.subtitle}
                onSave={(value) => handleFieldUpdate("hero", "subtitle", value)}
                placeholder="Enter subtitle"
                className="text-xl opacity-90"
              />
            </div>
          ) : (
            <p className="text-xl mb-6 opacity-90">{heroContent.subtitle}</p>
          )}

          {/* Hero Description */}
          {isEditable ? (
            <div className="mb-6">
              <EditableField
                value={heroContent.description}
                onSave={(value) => handleFieldUpdate("hero", "description", value)}
                placeholder="Enter description"
                multiline
                className="text-lg opacity-80 max-w-3xl mx-auto"
              />
            </div>
          ) : (
            <p className="text-lg mb-6 opacity-80 max-w-3xl mx-auto">{heroContent.description}</p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-6">
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

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {isEditable ? (
                  <EditableField
                    value={aboutContent.title}
                    onSave={(value) => handleFieldUpdate("about", "title", value)}
                    placeholder="About section title"
                  />
                ) : (
                  aboutContent.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditable ? (
                <EditableField
                  value={aboutContent.bio}
                  onSave={(value) => handleFieldUpdate("about", "bio", value)}
                  placeholder="Tell your story..."
                  multiline
                  className="text-gray-600 leading-relaxed"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{aboutContent.bio}</p>
              )}

              {trainer.certifications && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Certifications
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {isEditable ? (
                      <EditableField
                        value={trainer.certifications}
                        onSave={(value) => handleFieldUpdate("trainer", "certifications", value)}
                        placeholder="List your certifications"
                        className="text-gray-700"
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
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2" />
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicesContent.length > 0 ? (
                  servicesContent.map((service, index) => (
                    <div
                      key={service.id || index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {isEditable ? (
                            <EditableField
                              value={service.title}
                              onSave={(value) => handleFieldUpdate("services", `${index}.title`, value)}
                              placeholder="Service title"
                              className="font-semibold"
                            />
                          ) : (
                            <h3 className="font-semibold">{service.title}</h3>
                          )}
                          {service.featured && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            €
                            {isEditable ? (
                              <EditableField
                                value={service.price.toString()}
                                onSave={(value) => handleFieldUpdate("services", `${index}.price`, value)}
                                placeholder="Price"
                              />
                            ) : (
                              service.price
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {isEditable ? (
                              <EditableField
                                value={service.duration}
                                onSave={(value) => handleFieldUpdate("services", `${index}.duration`, value)}
                                placeholder="Duration"
                              />
                            ) : (
                              service.duration
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditable ? (
                        <EditableField
                          value={service.description}
                          onSave={(value) => handleFieldUpdate("services", `${index}.description`, value)}
                          placeholder="Service description"
                          multiline
                          className="text-gray-600 text-sm mb-3"
                        />
                      ) : (
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      )}
                      {!isPublic && (
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
                {isEditable ? (
                  <EditableField
                    value={contactContent.title}
                    onSave={(value) => handleFieldUpdate("contact", "title", value)}
                    placeholder="Contact section title"
                  />
                ) : (
                  contactContent.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditable ? (
                <EditableField
                  value={contactContent.description}
                  onSave={(value) => handleFieldUpdate("contact", "description", value)}
                  placeholder="Contact description"
                  multiline
                  className="text-gray-600 text-sm"
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
              {!isPublic && (
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
          {mode === "temp-edit" && !isExpired && (
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

          {/* Save Changes Panel - Only for editing modes */}
          {isEditable && hasUnsavedChanges && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-orange-900 mb-2">Unsaved Changes</h3>
                  <p className="text-sm text-orange-600 mb-4">You have unsaved changes to your profile.</p>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={onSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={onCancel} disabled={saving}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
