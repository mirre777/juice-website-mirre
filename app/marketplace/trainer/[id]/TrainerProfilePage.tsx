"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Users, Dumbbell, Award, Phone, Mail, Edit, ExternalLink, Save, X, Plus, Trash2 } from "lucide-react"

interface TrainerProfilePageProps {
  trainerId: string
}

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

interface TrainerContent {
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
  services: Service[]
  seo: {
    title: string
    description: string
  }
}

interface TrainerData {
  id: string
  fullName: string
  email: string
  experience: string
  specialty: string
  certifications?: string
  services: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  content?: TrainerContent
}

export default function TrainerProfilePage({ trainerId }: TrainerProfilePageProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingContent, setEditingContent] = useState<TrainerContent | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchTrainer = async () => {
      try {
        console.log("=== FETCHING TRAINER PROFILE ===")
        console.log("Trainer ID:", trainerId)

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        const data = await response.json()

        console.log("API Response:", data)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Trainer profile not found")
          } else if (response.status === 403) {
            setError("This trainer profile is not active")
          } else {
            setError(data.error || "Failed to load trainer profile")
          }
          setLoading(false)
          return
        }

        if (data.success && data.trainer) {
          console.log("Setting trainer data:", data.trainer)
          setTrainer(data.trainer)

          // Initialize editing content with safe property access
          const content = data.content || generateDefaultContent(data.trainer)
          setEditingContent(content)
        } else {
          setError(data.error || "Failed to load trainer data")
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching trainer:", err)
        setError("Failed to load trainer profile")
        setLoading(false)
      }
    }

    if (trainerId) {
      fetchTrainer()
    }
  }, [trainerId, mounted])

  const generateDefaultContent = (trainer: TrainerData): TrainerContent => {
    // Safe property access with fallbacks
    const fullName = trainer.fullName || "Trainer"
    const specialty = trainer.specialty || "Fitness"
    const experience = trainer.experience || "experience"
    const email = trainer.email || ""

    // Get bio from content.about.bio or fallback
    const bio =
      trainer.content?.about?.bio ||
      `Passionate ${specialty} trainer with ${experience} helping clients achieve their health and fitness goals.`

    // Get contact info from content.contact or fallback
    const phone = trainer.content?.contact?.phone || ""
    const location = trainer.content?.contact?.location || ""

    return {
      hero: {
        title: `Transform Your Fitness with ${fullName}`,
        subtitle: `Professional ${specialty} trainer with ${experience} of experience`,
        description: bio,
      },
      about: {
        title: "About Me",
        bio: bio,
      },
      contact: {
        title: "Let's Start Your Fitness Journey",
        description:
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        phone: phone,
        email: email,
        location: location,
      },
      services: [
        {
          id: "1",
          title: "Personal Training Session",
          description: "One-on-one personalized training session focused on your specific goals",
          price: 60,
          duration: "60 minutes",
          featured: true,
        },
        {
          id: "2",
          title: "Fitness Assessment",
          description: "Comprehensive fitness evaluation and goal-setting session",
          price: 40,
          duration: "45 minutes",
          featured: false,
        },
      ],
      seo: {
        title: `${fullName} - Personal Trainer`,
        description: `Professional ${specialty} training with ${fullName}. Transform your fitness with personalized programs.`,
      },
    }
  }

  const handleStartEditing = () => {
    setIsEditing(true)
    setHasUnsavedChanges(false)
  }

  const handleCancelEditing = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setIsEditing(false)
        setHasUnsavedChanges(false)
        // Reset editing content to original
        if (trainer) {
          const content = trainer.content || generateDefaultContent(trainer)
          setEditingContent(content)
        }
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!editingContent) return

    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to save content")
      }

      // Update trainer data with new content
      if (trainer) {
        setTrainer({ ...trainer, content: editingContent })
      }

      setIsEditing(false)
      setHasUnsavedChanges(false)

      toast({
        title: "Success",
        description: "Content saved successfully!",
      })
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (path: string, value: any) => {
    if (!editingContent) return

    const keys = path.split(".")
    const newContent = { ...editingContent }
    let current: any = newContent

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setEditingContent(newContent)
    setHasUnsavedChanges(true)
  }

  const addService = () => {
    if (!editingContent) return

    const newService: Service = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: 50,
      duration: "60 minutes",
      featured: false,
    }

    updateContent("services", [...editingContent.services, newService])
  }

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    if (!editingContent) return

    const updatedServices = editingContent.services.map((service) =>
      service.id === serviceId ? { ...service, ...updates } : service,
    )
    updateContent("services", updatedServices)
  }

  const removeService = (serviceId: string) => {
    if (!editingContent) return

    const updatedServices = editingContent.services.filter((service) => service.id !== serviceId)
    updateContent("services", updatedServices)
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
                  Back to Marketplace
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!trainer || !editingContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-4">The trainer profile could not be loaded.</p>
              <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayContent = isEditing ? editingContent : trainer.content || editingContent

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Editing States */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Status Badges */}
              <Badge variant="default" className="bg-green-500">
                {trainer.isActive ? "Live" : "Draft"}
              </Badge>
              <Badge variant="secondary">{isEditing ? "Editing Mode" : "Active Profile"}</Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  Unsaved Changes
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!isEditing ? (
                // View Mode Actions
                <>
                  <Button
                    variant="outline"
                    onClick={handleStartEditing}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/marketplace/trainer/${trainerId}/dashboard`)}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </>
              ) : (
                // Edit Mode Actions
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancelEditing}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={saving || !hasUnsavedChanges}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Now Editable */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 relative group">
          <div className="max-w-4xl mx-auto text-center">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/80 text-sm">Hero Title</Label>
                  <Input
                    value={displayContent.hero.title}
                    onChange={(e) => updateContent("hero.title", e.target.value)}
                    className="text-center text-4xl md:text-5xl font-bold bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Your main headline"
                  />
                </div>
                <div>
                  <Label className="text-white/80 text-sm">Subtitle</Label>
                  <Input
                    value={displayContent.hero.subtitle}
                    onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                    className="text-center text-xl bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Supporting headline"
                  />
                </div>
                <div>
                  <Label className="text-white/80 text-sm">Description</Label>
                  <Textarea
                    value={displayContent.hero.description}
                    onChange={(e) => updateContent("hero.description", e.target.value)}
                    className="text-center bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Brief introduction"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayContent.hero.title}</h1>
                <p className="text-xl mb-6 opacity-90">{displayContent.hero.subtitle}</p>
                <p className="text-lg mb-6 opacity-80 max-w-3xl mx-auto">{displayContent.hero.description}</p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="text-blue-600">
                <Award className="h-4 w-4 mr-1" />
                {trainer.experience} Experience
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <MapPin className="h-4 w-4 mr-1" />
                {displayContent.contact.location}
              </Badge>
              <Badge variant="secondary" className="text-blue-600">
                <Dumbbell className="h-4 w-4 mr-1" />
                {trainer.specialty}
              </Badge>
            </div>
            <Button size="lg" variant="secondary" className="text-blue-600">
              Book Free Consultation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="relative group">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {isEditing ? (
                    <Input
                      value={displayContent.about.title}
                      onChange={(e) => updateContent("about.title", e.target.value)}
                      className="font-semibold"
                      placeholder="About section title"
                    />
                  ) : (
                    displayContent.about.title
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={displayContent.about.bio}
                    onChange={(e) => updateContent("about.bio", e.target.value)}
                    placeholder="Tell your story..."
                    rows={8}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{displayContent.about.bio}</p>
                )}
                {trainer.certifications && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <p className="text-gray-600">{trainer.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2" />
                    Services Offered
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={addService} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Service
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayContent.services.map((service, index) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 relative">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={service.title}
                                onChange={(e) => updateService(service.id, { title: e.target.value })}
                                placeholder="Service title"
                                className="font-semibold"
                              />
                              <Textarea
                                value={service.description}
                                onChange={(e) => updateService(service.id, { description: e.target.value })}
                                placeholder="Service description"
                                rows={2}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeService(service.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Price (€)</Label>
                              <Input
                                type="number"
                                value={service.price}
                                onChange={(e) =>
                                  updateService(service.id, { price: Number.parseInt(e.target.value) || 0 })
                                }
                                placeholder="Price"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Duration</Label>
                              <Input
                                value={service.duration}
                                onChange={(e) => updateService(service.id, { duration: e.target.value })}
                                placeholder="Duration"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={service.featured}
                                  onChange={(e) => updateService(service.id, { featured: e.target.checked })}
                                  className="rounded"
                                />
                                <span className="text-xs">Featured</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{service.title}</h3>
                              {service.featured && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">€{service.price}</div>
                              <div className="text-sm text-gray-500">{service.duration}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </>
                      )}
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
              <CardHeader>
                <CardTitle>
                  {isEditing ? (
                    <Input
                      value={displayContent.contact.title}
                      onChange={(e) => updateContent("contact.title", e.target.value)}
                      placeholder="Contact section title"
                    />
                  ) : (
                    displayContent.contact.title
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div>
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      value={displayContent.contact.description}
                      onChange={(e) => updateContent("contact.description", e.target.value)}
                      placeholder="Contact description"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-sm">{displayContent.contact.email}</span>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={displayContent.contact.phone}
                      onChange={(e) => updateContent("contact.phone", e.target.value)}
                      placeholder="Phone number"
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm">{displayContent.contact.phone}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={displayContent.contact.location}
                      onChange={(e) => updateContent("contact.location", e.target.value)}
                      placeholder="Location"
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm">{displayContent.contact.location}</span>
                  )}
                </div>

                <Separator />
                <Button className="w-full">Schedule Consultation</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">{trainer.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty</span>
                  <span className="font-semibold">{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{displayContent.contact.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-semibold">{displayContent.services.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
