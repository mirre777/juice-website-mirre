"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Users, Dumbbell, Phone, Plus, Trash2 } from "lucide-react"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"

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
  const [isPublicView, setIsPublicView] = useState(false)
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
          const content = generateDefaultContent(data.trainer, data.content)
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

  const generateDefaultContent = (trainer: TrainerData, existingContent?: any): TrainerContent => {
    // Safe property access with fallbacks
    const fullName = trainer?.fullName || "Trainer"
    const specialty = trainer?.specialty || "Fitness"
    const experience = trainer?.experience || "experience"
    const email = trainer?.email || ""

    // Safely extract existing content or use fallbacks
    const existingHero = existingContent?.hero || trainer?.content?.hero || {}
    const existingAbout = existingContent?.about || trainer?.content?.about || {}
    const existingContact = existingContent?.contact || trainer?.content?.contact || {}
    const existingServices = existingContent?.services || trainer?.content?.services || []

    // Generate bio from existing content or fallback
    const bio =
      existingAbout.bio ||
      existingAbout.content ||
      `Passionate ${specialty} trainer with ${experience} helping clients achieve their health and fitness goals.`

    // Get contact info with fallbacks
    const phone = existingContact.phone || ""
    const location = existingContact.location || ""

    // Ensure services is always an array
    let servicesArray: Service[] = []

    if (Array.isArray(existingServices)) {
      servicesArray = existingServices
    } else if (Array.isArray(trainer?.services)) {
      // Convert string array to Service objects
      servicesArray = trainer.services.map((service, index) => ({
        id: (index + 1).toString(),
        title: service,
        description: `Professional ${service.toLowerCase()} service`,
        price: 60,
        duration: "60 minutes",
        featured: index === 0,
      }))
    }

    // If still no services, provide defaults
    if (servicesArray.length === 0) {
      servicesArray = [
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
      ]
    }

    return {
      hero: {
        title: existingHero.title || `Transform Your Fitness with ${fullName}`,
        subtitle: existingHero.subtitle || `Professional ${specialty} trainer with ${experience} of experience`,
        description: existingHero.description || bio,
      },
      about: {
        title: existingAbout.title || "About Me",
        bio: bio,
      },
      contact: {
        title: existingContact.title || "Let's Start Your Fitness Journey",
        description:
          existingContact.description ||
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        phone: phone,
        email: email,
        location: location,
      },
      services: servicesArray,
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
          const content = generateDefaultContent(trainer, trainer.content)
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
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
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

    const currentServices = Array.isArray(editingContent.services) ? editingContent.services : []
    updateContent("services", [...currentServices, newService])
  }

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    if (!editingContent || !Array.isArray(editingContent.services)) return

    const updatedServices = editingContent.services.map((service) =>
      service.id === serviceId ? { ...service, ...updates } : service,
    )
    updateContent("services", updatedServices)
  }

  const removeService = (serviceId: string) => {
    if (!editingContent || !Array.isArray(editingContent.services)) return

    const updatedServices = editingContent.services.filter((service) => service.id !== serviceId)
    updateContent("services", updatedServices)
  }

  const handleExitPublicView = () => {
    setIsPublicView(false)
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

  // Safe access to display content with fallbacks
  const displayContent = isEditing ? editingContent : trainer.content || editingContent

  // If in public view mode, render the shared component in preview mode
  if (isPublicView) {
    return (
      <TrainerProfileDisplay
        trainer={trainer}
        content={displayContent}
        mode="preview"
        onExitPreview={handleExitPublicView}
      />
    )
  }

  // Otherwise render the shared component in live mode with editing capabilities
  return (
    <TrainerProfileDisplay
      trainer={trainer}
      content={displayContent}
      mode="live"
      isEditing={isEditing}
      editingContent={editingContent}
      onEdit={handleStartEditing}
      onViewLive={() => setIsPublicView(true)}
      onDashboard={() => router.push(`/marketplace/trainer/${trainerId}/dashboard`)}
      onSave={handleSaveChanges}
      onCancel={handleCancelEditing}
      hasUnsavedChanges={hasUnsavedChanges}
      saving={saving}
      showHeader={true}
      headerActions={
        isEditing ? (
          <div className="space-y-4">
            {/* Hero Section Editing */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80 text-sm">Hero Title</Label>
                    <Input
                      value={editingContent.hero.title}
                      onChange={(e) => updateContent("hero.title", e.target.value)}
                      className="text-center text-2xl font-bold bg-white/10 border-white/20 text-white placeholder-white/60"
                      placeholder="Your main headline"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 text-sm">Subtitle</Label>
                    <Input
                      value={editingContent.hero.subtitle}
                      onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                      className="text-center text-lg bg-white/10 border-white/20 text-white placeholder-white/60"
                      placeholder="Supporting headline"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80 text-sm">Description</Label>
                    <Textarea
                      value={editingContent.hero.description}
                      onChange={(e) => updateContent("hero.description", e.target.value)}
                      className="text-center bg-white/10 border-white/20 text-white placeholder-white/60"
                      placeholder="Brief introduction"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section Editing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <Input
                    value={editingContent.about.title}
                    onChange={(e) => updateContent("about.title", e.target.value)}
                    className="font-semibold"
                    placeholder="About section title"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editingContent.about.bio}
                  onChange={(e) => updateContent("about.bio", e.target.value)}
                  placeholder="Tell your story..."
                  rows={8}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Services Section Editing */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2" />
                    Services Offered
                  </CardTitle>
                  <Button onClick={addService} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(editingContent.services) && editingContent.services.length > 0 ? (
                    editingContent.services.map((service, index) => (
                      <div key={service.id || index} className="border border-gray-200 rounded-lg p-4 relative">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={service.title || ""}
                                onChange={(e) => updateService(service.id, { title: e.target.value })}
                                placeholder="Service title"
                                className="font-semibold"
                              />
                              <Textarea
                                value={service.description || ""}
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
                                value={service.price || 0}
                                onChange={(e) =>
                                  updateService(service.id, { price: Number.parseInt(e.target.value) || 0 })
                                }
                                placeholder="Price"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Duration</Label>
                              <Input
                                value={service.duration || ""}
                                onChange={(e) => updateService(service.id, { duration: e.target.value })}
                                placeholder="Duration"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={service.featured || false}
                                  onChange={(e) => updateService(service.id, { featured: e.target.checked })}
                                  className="rounded"
                                />
                                <span className="text-xs">Featured</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No services available</p>
                      <Button onClick={addService} className="mt-4">
                        Add Your First Service
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section Editing */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Input
                    value={editingContent.contact.title}
                    onChange={(e) => updateContent("contact.title", e.target.value)}
                    placeholder="Contact section title"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    value={editingContent.contact.description}
                    onChange={(e) => updateContent("contact.description", e.target.value)}
                    placeholder="Contact description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <Input
                    value={editingContent.contact.phone}
                    onChange={(e) => updateContent("contact.phone", e.target.value)}
                    placeholder="Phone number"
                    className="text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <Input
                    value={editingContent.contact.location}
                    onChange={(e) => updateContent("contact.location", e.target.value)}
                    placeholder="Location"
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : undefined
      }
    />
  )
}
