"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react"
import type { TrainerProfile, TrainerContent, Service } from "@/types/trainer"

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const router = useRouter()
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch trainer data")
      }
      const data = await response.json()
      setTrainer(data.trainer)
      setContent(data.content || generateDefaultContent(data.trainer))
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      toast({
        title: "Error",
        description: "Failed to load trainer data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultContent = (trainer: TrainerProfile): TrainerContent => {
    return {
      hero: {
        title: `Transform Your Fitness with ${trainer.name}`,
        subtitle: `Professional ${trainer.specialization} training tailored to your goals`,
        description: `Welcome! I'm ${trainer.name}, a certified personal trainer specializing in ${trainer.specialization}. With ${trainer.experience} of experience, I'm here to help you achieve your fitness goals through personalized training programs.`,
      },
      about: {
        title: "About Me",
        content: `I'm ${trainer.name}, a passionate fitness professional with ${trainer.experience} of experience in ${trainer.specialization}. I believe that fitness is not just about physical transformation, but about building confidence, discipline, and a healthier lifestyle.\n\nMy approach is personalized and results-driven. Whether you're just starting your fitness journey or looking to break through plateaus, I'll work with you to create a program that fits your lifestyle and helps you achieve your goals.\n\nI'm certified and committed to staying up-to-date with the latest fitness trends and techniques to provide you with the best possible training experience.`,
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
        {
          id: "3",
          title: "Custom Workout Plan",
          description: "Personalized workout program designed for your goals and schedule",
          price: 80,
          duration: "Digital delivery",
          featured: false,
        },
      ],
      contact: {
        title: "Let's Start Your Fitness Journey",
        description:
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        email: trainer.email,
        phone: trainer.phone || "",
        location: trainer.location,
      },
      seo: {
        title: `${trainer.name} - Personal Trainer in ${trainer.location}`,
        description: `Professional ${trainer.specialization} training with ${trainer.name}. Transform your fitness with personalized programs in ${trainer.location}.`,
      },
    }
  }

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to save content")
      }

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

  const addService = () => {
    if (!content) return

    const newService: Service = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: 50,
      duration: "60 minutes",
      featured: false,
    }

    setContent({
      ...content,
      services: [...content.services, newService],
    })
  }

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    if (!content) return

    setContent({
      ...content,
      services: content.services.map((service) => (service.id === serviceId ? { ...service, ...updates } : service)),
    })
  }

  const removeService = (serviceId: string) => {
    if (!content) return

    setContent({
      ...content,
      services: content.services.filter((service) => service.id !== serviceId),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!trainer || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trainer not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Your Website</h1>
                <p className="text-gray-600">Customize your trainer profile content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/trainer/${trainerId}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Main Title</Label>
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
                  rows={4}
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
                <Label htmlFor="about-title">Section Title</Label>
                <Input
                  id="about-title"
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                  placeholder="About section title"
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services</CardTitle>
                <Button onClick={addService} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.services.map((service) => (
                  <Card key={service.id} className="relative">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {service.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div>
                        <Input
                          value={service.title}
                          onChange={(e) => updateService(service.id, { title: e.target.value })}
                          placeholder="Service title"
                          className="font-medium"
                        />
                      </div>

                      <div>
                        <Textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, { description: e.target.value })}
                          placeholder="Service description"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Price (€)</Label>
                          <Input
                            type="number"
                            value={service.price}
                            onChange={(e) => updateService(service.id, { price: Number.parseInt(e.target.value) || 0 })}
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
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`featured-${service.id}`}
                          checked={service.featured}
                          onChange={(e) => updateService(service.id, { featured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor={`featured-${service.id}`} className="text-sm">
                          Featured service
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-title">Section Title</Label>
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
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone (Optional)</Label>
                <Input
                  id="contact-phone"
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value },
                    })
                  }
                  placeholder="Phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
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
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSave} disabled={saving} size="lg" className="px-8">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving Changes..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
