"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Check } from "lucide-react"
import Link from "next/link"
import type { TrainerData, TrainerContent, Service } from "@/types/trainer"

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainer(data.trainer)
        setContent(data.content || generateDefaultContent(data.trainer))
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultContent = (trainerData: TrainerData): TrainerContent => {
    return {
      hero: {
        title: `Transform Your Fitness with ${trainerData.name}`,
        subtitle: `Professional ${trainerData.specialization} Training`,
        description: `Achieve your fitness goals with personalized training from ${trainerData.name}. With ${trainerData.experience} years of experience, I'm here to help you succeed.`,
      },
      about: {
        title: "About Me",
        content: `Hi, I'm ${trainerData.name}, a certified ${trainerData.specialization} trainer with ${trainerData.experience} years of experience. I'm passionate about helping people achieve their fitness goals through personalized training programs.

My approach focuses on sustainable results and building healthy habits that last. Whether you're just starting your fitness journey or looking to break through plateaus, I'm here to guide and support you every step of the way.

Based in ${trainerData.location}, I offer both in-person and virtual training sessions to fit your lifestyle and preferences.`,
      },
      services: [
        {
          id: "1",
          title: "Personal Training Session",
          description: "One-on-one personalized training session tailored to your goals",
          price: "€60",
          duration: "60 minutes",
        },
        {
          id: "2",
          title: "Fitness Assessment",
          description: "Comprehensive fitness evaluation and goal-setting session",
          price: "€40",
          duration: "45 minutes",
        },
        {
          id: "3",
          title: "Custom Workout Plan",
          description: "Personalized workout program designed for your specific needs",
          price: "€80",
          duration: "One-time",
        },
      ],
      contact: {
        title: "Get Started Today",
        description: "Ready to begin your fitness transformation? Contact me to schedule your first session.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        availability: "Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 8:00 AM - 6:00 PM\nSunday: By appointment",
      },
      seo: {
        title: `${trainerData.name} - Professional ${trainerData.specialization} Trainer in ${trainerData.location}`,
        description: `Transform your fitness with ${trainerData.name}, a certified ${trainerData.specialization} trainer in ${trainerData.location}. ${trainerData.experience} years of experience helping clients achieve their goals.`,
      },
    }
  }

  const saveContent = async () => {
    if (!content) return

    setSaving(true)
    setSaveStatus("saving")

    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      setSaveStatus("error")
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
      price: "€50",
      duration: "60 minutes",
    }

    setContent({
      ...content,
      services: [...content.services, newService],
    })
  }

  const removeService = (serviceId: string) => {
    if (!content) return

    setContent({
      ...content,
      services: content.services.filter((service) => service.id !== serviceId),
    })
  }

  const updateService = (serviceId: string, field: keyof Service, value: string) => {
    if (!content) return

    setContent({
      ...content,
      services: content.services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service,
      ),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juice"></div>
      </div>
    )
  }

  if (!trainer || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trainer Not Found</h1>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href={`/marketplace/trainer/${trainerId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600">Customize your trainer profile content</p>
          </div>
        </div>
        <Button onClick={saveContent} disabled={saving}>
          {saveStatus === "saving" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={content.hero.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                placeholder="Main headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <Input
                value={content.hero.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value },
                  })
                }
                placeholder="Subtitle or tagline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={content.hero.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value },
                  })
                }
                placeholder="Brief description"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <Input
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <Textarea
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
          <CardContent>
            <div className="space-y-6">
              {content.services.map((service, index) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Service {index + 1}</Badge>
                    {content.services.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                        placeholder="Service title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <Input
                        value={service.price}
                        onChange={(e) => updateService(service.id, "price", e.target.value)}
                        placeholder="€50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <Input
                        value={service.duration}
                        onChange={(e) => updateService(service.id, "duration", e.target.value)}
                        placeholder="60 minutes"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Service description"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <Input
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value },
                    })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <Textarea
                value={content.contact.availability}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contact: { ...content.contact, availability: e.target.value },
                  })
                }
                placeholder="Your availability schedule"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <Input
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <Textarea
                value={content.seo.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    seo: { ...content.seo, description: e.target.value },
                  })
                }
                placeholder="SEO meta description"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={saveContent} disabled={saving} size="lg">
          {saveStatus === "saving" ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving Changes...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Changes Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
