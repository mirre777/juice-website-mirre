"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
}

interface TrainerContent {
  heroTitle?: string
  heroSubtitle?: string
  aboutTitle?: string
  aboutDescription?: string
  services?: Service[]
  contactEmail?: string
  contactPhone?: string
  contactLocation?: string
  seoTitle?: string
  seoDescription?: string
}

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [content, setContent] = useState<TrainerContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trainerData, setTrainerData] = useState<any>(null)

  useEffect(() => {
    fetchTrainerData()
  }, [trainerId])

  const fetchTrainerData = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setTrainerData(data.trainer)
        setContent(data.trainer.content || generateDefaultContent(data.trainer))
      } else {
        toast.error("Failed to load trainer data")
      }
    } catch (error) {
      console.error("Error fetching trainer data:", error)
      toast.error("Error loading trainer data")
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultContent = (trainer: any): TrainerContent => {
    return {
      heroTitle: `Transform Your Fitness with ${trainer.name}`,
      heroSubtitle: `Professional ${trainer.specialization} training tailored to your goals`,
      aboutTitle: "About Me",
      aboutDescription: `Hi, I'm ${trainer.name}, a certified ${trainer.specialization} trainer with ${trainer.experience} years of experience. I'm passionate about helping clients achieve their fitness goals through personalized training programs.`,
      services: [
        {
          id: "1",
          title: "Personal Training",
          description: "One-on-one training sessions tailored to your specific goals",
          price: "€60",
          duration: "60 min",
        },
        {
          id: "2",
          title: "Group Training",
          description: "Small group sessions for motivation and community",
          price: "€30",
          duration: "45 min",
        },
      ],
      contactEmail: trainer.email,
      contactPhone: trainer.phone || "",
      contactLocation: trainer.location || "",
      seoTitle: `${trainer.name} - Professional ${trainer.specialization} Trainer`,
      seoDescription: `Book personal training sessions with ${trainer.name}, a certified ${trainer.specialization} trainer. Transform your fitness journey today.`,
    }
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        toast.success("Content saved successfully!")
      } else {
        toast.error("Failed to save content")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Error saving content")
    } finally {
      setSaving(false)
    }
  }

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: "€50",
      duration: "60 min",
    }
    setContent((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService],
    }))
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services?.map((service) => (service.id === id ? { ...service, [field]: value } : service)),
    }))
  }

  const removeService = (id: string) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services?.filter((service) => service.id !== id),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juice"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/marketplace/trainer/${trainerId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Content</h1>
            <p className="text-gray-600">Customize your trainer profile content</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/marketplace/trainer/${trainerId}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button onClick={saveContent} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <Input
                value={content.heroTitle || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="Your main headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
              <Textarea
                value={content.heroSubtitle || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="Supporting text for your headline"
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
              <label className="block text-sm font-medium mb-2">About Title</label>
              <Input
                value={content.aboutTitle || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, aboutTitle: e.target.value }))}
                placeholder="About section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">About Description</label>
              <Textarea
                value={content.aboutDescription || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, aboutDescription: e.target.value }))}
                placeholder="Tell your story and experience"
                rows={6}
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
              {content.services?.map((service, index) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Service {index + 1}</Badge>
                    <Button onClick={() => removeService(service.id)} variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Title</label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                        placeholder="Service name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <Input
                        value={service.price}
                        onChange={(e) => updateService(service.id, "price", e.target.value)}
                        placeholder="€50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <Input
                        value={service.duration}
                        onChange={(e) => updateService(service.id, "duration", e.target.value)}
                        placeholder="60 min"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Service description"
                        rows={3}
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
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={content.contactEmail || ""}
                  onChange={(e) => setContent((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={content.contactPhone || ""}
                  onChange={(e) => setContent((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={content.contactLocation || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, contactLocation: e.target.value }))}
                placeholder="Amsterdam, Netherlands"
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
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <Input
                value={content.seoTitle || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SEO Description</label>
              <Textarea
                value={content.seoDescription || ""}
                onChange={(e) => setContent((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Description for search engines (150-160 characters)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
