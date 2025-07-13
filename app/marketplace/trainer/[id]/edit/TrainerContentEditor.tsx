"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Save, Plus, Trash2, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import type { TrainerContent, Service } from "@/types/trainer"

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    fetchTrainerContent()
  }, [trainerId])

  const fetchTrainerContent = async () => {
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        toast.error("Failed to load trainer content")
      }
    } catch (error) {
      console.error("Error fetching trainer content:", error)
      toast.error("Error loading content")
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!content) return

    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setLastSaved(new Date())
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

  const updateContent = (field: keyof TrainerContent, value: any) => {
    if (!content) return
    setContent({ ...content, [field]: value })
  }

  const addService = () => {
    if (!content) return
    const newService: Service = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      price: 50,
      duration: "60 minutes",
      category: "training",
    }
    updateContent("services", [...(content.services || []), newService])
  }

  const updateService = (serviceId: string, field: keyof Service, value: any) => {
    if (!content) return
    const updatedServices =
      content.services?.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)) || []
    updateContent("services", updatedServices)
  }

  const removeService = (serviceId: string) => {
    if (!content) return
    const updatedServices = content.services?.filter((service) => service.id !== serviceId) || []
    updateContent("services", updatedServices)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load trainer content for editing.</p>
          <Link href={`/marketplace/trainer/${trainerId}`}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600">Customize your trainer profile content</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && <span className="text-sm text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</span>}
          <Link href={`/marketplace/trainer/${trainerId}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button onClick={saveContent} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
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
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.heroTitle || ""}
                onChange={(e) => updateContent("heroTitle", e.target.value)}
                placeholder="Your main headline"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={content.heroSubtitle || ""}
                onChange={(e) => updateContent("heroSubtitle", e.target.value)}
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
              <Label htmlFor="about-title">Section Title</Label>
              <Input
                id="about-title"
                value={content.aboutTitle || ""}
                onChange={(e) => updateContent("aboutTitle", e.target.value)}
                placeholder="About section title"
              />
            </div>
            <div>
              <Label htmlFor="about-content">Content</Label>
              <Textarea
                id="about-content"
                value={content.aboutContent || ""}
                onChange={(e) => updateContent("aboutContent", e.target.value)}
                placeholder="Tell your story, experience, and approach..."
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
                <Plus className="w-4 h-4 mr-2" />
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
                    <Button
                      onClick={() => removeService(service.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Service Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                        placeholder="Service name"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={service.category}
                        onChange={(e) => updateService(service.id, "category", e.target.value)}
                        placeholder="e.g., training, nutrition"
                      />
                    </div>
                    <div>
                      <Label>Price (€)</Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, "price", Number.parseInt(e.target.value) || 0)}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={service.duration}
                        onChange={(e) => updateService(service.id, "duration", e.target.value)}
                        placeholder="60 minutes"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Describe what this service includes..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!content.services || content.services.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No services added yet. Click "Add Service" to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact-title">Section Title</Label>
              <Input
                id="contact-title"
                value={content.contactTitle || ""}
                onChange={(e) => updateContent("contactTitle", e.target.value)}
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <Label htmlFor="contact-description">Description</Label>
              <Textarea
                id="contact-description"
                value={content.contactDescription || ""}
                onChange={(e) => updateContent("contactDescription", e.target.value)}
                placeholder="How clients can reach you..."
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
                value={content.seoTitle || ""}
                onChange={(e) => updateContent("seoTitle", e.target.value)}
                placeholder="SEO-optimized page title"
              />
            </div>
            <div>
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={content.seoDescription || ""}
                onChange={(e) => updateContent("seoDescription", e.target.value)}
                placeholder="Brief description for search engines..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Footer */}
      <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : "Unsaved changes"}
          </div>
          <Button onClick={saveContent} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
