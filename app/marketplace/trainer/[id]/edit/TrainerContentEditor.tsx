"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, Trash2, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import type { TrainerData, TrainerContent, Service } from "@/types/trainer"
import { logger } from "@/lib/logger"

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load trainer data and content
  useEffect(() => {
    async function loadTrainerData() {
      try {
        setLoading(true)
        logger.info("Loading trainer data for editing", { trainerId })

        const response = await fetch(`/api/trainer/content/${trainerId}`)
        if (!response.ok) {
          throw new Error(`Failed to load trainer data: ${response.statusText}`)
        }

        const data = await response.json()
        setTrainer(data.trainer)
        setContent(data.content || generateDefaultContent(data.trainer))

        logger.info("Trainer data loaded successfully", {
          trainerId,
          hasContent: !!data.content,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load trainer data"
        setError(errorMessage)
        logger.error("Failed to load trainer data", { trainerId, error: errorMessage })
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (trainerId) {
      loadTrainerData()
    }
  }, [trainerId])

  // Generate default content from trainer data
  function generateDefaultContent(trainerData: TrainerData): TrainerContent {
    const services: Service[] = [
      {
        id: "1",
        title: "Personal Training Session",
        description: "One-on-one personalized training session tailored to your fitness goals.",
        price: "€75",
        duration: "60 minutes",
      },
      {
        id: "2",
        title: "Nutrition Consultation",
        description: "Comprehensive nutrition plan and dietary guidance for optimal results.",
        price: "€50",
        duration: "45 minutes",
      },
      {
        id: "3",
        title: "Fitness Assessment",
        description: "Complete fitness evaluation and goal-setting session.",
        price: "€40",
        duration: "30 minutes",
      },
    ]

    return {
      hero: {
        title: `Transform Your Fitness with ${trainerData.name}`,
        subtitle: `Professional ${trainerData.specialization} trainer dedicated to helping you achieve your fitness goals`,
        description: `Located in ${trainerData.location}, I bring ${trainerData.experience} of experience to help you reach your full potential.`,
      },
      about: {
        title: "About Me",
        content: `Hi, I'm ${trainerData.name}, a certified ${trainerData.specialization} trainer with ${trainerData.experience} of experience. I'm passionate about helping people transform their lives through fitness and nutrition. My approach is personalized, sustainable, and focused on long-term results.

My specialization in ${trainerData.specialization} allows me to provide expert guidance tailored to your specific needs and goals. Whether you're just starting your fitness journey or looking to break through plateaus, I'm here to support and motivate you every step of the way.

I believe that fitness should be enjoyable and sustainable. That's why I work closely with each client to develop programs that fit their lifestyle, preferences, and goals.`,
      },
      services,
      contact: {
        title: "Get Started Today",
        description: "Ready to begin your transformation? Contact me to schedule your first session.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        location: trainerData.location,
        availability: "Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 8:00 AM - 6:00 PM\nSunday: By appointment",
      },
      seo: {
        title: `${trainerData.name} - Professional ${trainerData.specialization} Trainer in ${trainerData.location}`,
        description: `Transform your fitness with ${trainerData.name}, a certified ${trainerData.specialization} trainer in ${trainerData.location}. ${trainerData.experience} of experience. Book your session today!`,
      },
    }
  }

  // Save content
  async function saveContent() {
    if (!content) return

    try {
      setSaving(true)
      logger.info("Saving trainer content", { trainerId })

      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save content: ${response.statusText}`)
      }

      logger.info("Trainer content saved successfully", { trainerId })
      toast({
        title: "Success",
        description: "Content saved successfully!",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save content"
      logger.error("Failed to save trainer content", { trainerId, error: errorMessage })
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Add new service
  function addService() {
    if (!content) return

    const newService: Service = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: "€50",
      duration: "60 minutes",
    }

    setContent({
      ...content,
      services: [...content.services, newService],
    })
  }

  // Remove service
  function removeService(serviceId: string) {
    if (!content) return

    setContent({
      ...content,
      services: content.services.filter((service) => service.id !== serviceId),
    })
  }

  // Update service
  function updateService(serviceId: string, updates: Partial<Service>) {
    if (!content) return

    setContent({
      ...content,
      services: content.services.map((service) => (service.id === serviceId ? { ...service, ...updates } : service)),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading trainer data...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !trainer || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error || "Failed to load trainer data"}</p>
                <Link href="/marketplace">
                  <Button>Back to Marketplace</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/marketplace/trainer/${trainerId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
              <p className="text-gray-600">Customize your trainer profile content</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/marketplace/trainer/${trainerId}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={saveContent} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.hero.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                placeholder="Your main headline"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value },
                  })
                }
                placeholder="Supporting headline"
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={content.hero.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value },
                  })
                }
                placeholder="Brief introduction"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title">Title</Label>
              <Input
                id="about-title"
                value={content.about.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, title: e.target.value },
                  })
                }
                placeholder="Section title"
              />
            </div>
            <div>
              <Label htmlFor="about-content">Content</Label>
              <Textarea
                id="about-content"
                value={content.about.content}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, content: e.target.value },
                  })
                }
                placeholder="Tell your story..."
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Services</CardTitle>
              <Button onClick={addService} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.services.map((service, index) => (
              <div key={service.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Service {index + 1}</Badge>
                  <Button
                    onClick={() => removeService(service.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => updateService(service.id, { title: e.target.value })}
                      placeholder="Service name"
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      value={service.price}
                      onChange={(e) => updateService(service.id, { price: e.target.value })}
                      placeholder="€50"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={service.duration}
                      onChange={(e) => updateService(service.id, { duration: e.target.value })}
                      placeholder="60 minutes"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={service.description}
                    onChange={(e) => updateService(service.id, { description: e.target.value })}
                    placeholder="Service description"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                value={content.contact.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, title: e.target.value },
                  })
                }
                placeholder="Contact section title"
              />
            </div>
            <div>
              <Label htmlFor="contact-description">Description</Label>
              <Textarea
                id="contact-description"
                value={content.contact.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, description: e.target.value },
                  })
                }
                placeholder="Contact description"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value },
                    })
                  }
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contact-location">Location</Label>
              <Input
                id="contact-location"
                value={content.contact.location}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, location: e.target.value },
                  })
                }
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="contact-availability">Availability</Label>
              <Textarea
                id="contact-availability"
                value={content.contact.availability}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, availability: e.target.value },
                  })
                }
                placeholder="Your availability hours"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Section */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seo-title">Page Title</Label>
              <Input
                id="seo-title"
                value={content.seo.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, title: e.target.value },
                  })
                }
                placeholder="SEO page title"
              />
            </div>
            <div>
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={content.seo.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, description: e.target.value },
                  })
                }
                placeholder="SEO meta description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveContent} disabled={saving} size="lg">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? "Saving Changes..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
