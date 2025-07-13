"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { TrainerContent, Service } from "@/types/trainer"
import { logger } from "@/lib/logger"

interface TrainerContentEditorProps {
  trainerId: string
}

export function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    loadTrainerContent()
  }, [trainerId])

  const loadTrainerContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trainer/content/${trainerId}`)

      if (!response.ok) {
        throw new Error("Failed to load trainer content")
      }

      const data = await response.json()
      setContent(data)
      logger.info("Trainer content loaded", { trainerId })
    } catch (error) {
      logger.error("Error loading trainer content", { error, trainerId })
      toast.error("Failed to load content")
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!content) return

    try {
      setSaving(true)
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error("Failed to save content")
      }

      setLastSaved(new Date())
      toast.success("Content saved successfully!")
      logger.info("Trainer content saved", { trainerId })
    } catch (error) {
      logger.error("Error saving trainer content", { error, trainerId })
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (field: keyof TrainerContent, value: any) => {
    if (!content) return

    setContent({
      ...content,
      [field]: value,
      updatedAt: new Date().toISOString(),
    })
  }

  const addService = () => {
    if (!content) return

    const newService: Service = {
      id: `service_${Date.now()}`,
      title: "New Service",
      description: "Service description",
      price: 50,
      duration: "60 minutes",
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No content found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={saveContent} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>

          {lastSaved && <Badge variant="outline">Last saved: {lastSaved.toLocaleTimeString()}</Badge>}
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
            <Label htmlFor="about-title">About Title</Label>
            <Input
              id="about-title"
              value={content.aboutTitle || ""}
              onChange={(e) => updateContent("aboutTitle", e.target.value)}
              placeholder="About section title"
            />
          </div>

          <div>
            <Label htmlFor="about-content">About Content</Label>
            <Textarea
              id="about-content"
              value={content.aboutContent || ""}
              onChange={(e) => updateContent("aboutContent", e.target.value)}
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
        <CardContent className="space-y-6">
          {content.services?.map((service, index) => (
            <div key={service.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Service {index + 1}</h4>
                <Button onClick={() => removeService(service.id)} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
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
                  <Label>Duration</Label>
                  <Input
                    value={service.duration}
                    onChange={(e) => updateService(service.id, "duration", e.target.value)}
                    placeholder="e.g., 60 minutes"
                  />
                </div>
              </div>

              <div>
                <Label>Price (€)</Label>
                <Input
                  type="number"
                  value={service.price}
                  onChange={(e) => updateService(service.id, "price", Number.parseInt(e.target.value) || 0)}
                  placeholder="Price in euros"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(service.id, "description", e.target.value)}
                  placeholder="Describe this service"
                  rows={3}
                />
              </div>
            </div>
          ))}

          {(!content.services || content.services.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No services added yet</p>
              <Button onClick={addService} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact-title">Contact Title</Label>
            <Input
              id="contact-title"
              value={content.contactTitle || ""}
              onChange={(e) => updateContent("contactTitle", e.target.value)}
              placeholder="Contact section title"
            />
          </div>

          <div>
            <Label htmlFor="contact-content">Contact Content</Label>
            <Textarea
              id="contact-content"
              value={content.contactContent || ""}
              onChange={(e) => updateContent("contactContent", e.target.value)}
              placeholder="How clients can reach you"
              rows={4}
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
              placeholder="SEO page title"
            />
          </div>

          <div>
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={content.seoDescription || ""}
              onChange={(e) => updateContent("seoDescription", e.target.value)}
              placeholder="SEO meta description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
