"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"
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
  aboutContent?: string
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

export function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [content, setContent] = useState<TrainerContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load trainer content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/trainer/content/${trainerId}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data.content || {})
        }
      } catch (error) {
        console.error("Error loading content:", error)
        toast.error("Failed to load content")
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [trainerId])

  // Auto-save functionality
  const saveContent = async (newContent: TrainerContent) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${trainerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        toast.success("Content saved successfully")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  // Update content and auto-save
  const updateContent = (updates: Partial<TrainerContent>) => {
    const newContent = { ...content, ...updates }
    setContent(newContent)
    saveContent(newContent)
  }

  // Service management
  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: "",
      description: "",
      price: "",
      duration: "",
    }
    updateContent({
      services: [...(content.services || []), newService],
    })
  }

  const updateService = (serviceId: string, updates: Partial<Service>) => {
    const updatedServices = (content.services || []).map((service) =>
      service.id === serviceId ? { ...service, ...updates } : service,
    )
    updateContent({ services: updatedServices })
  }

  const removeService = (serviceId: string) => {
    const updatedServices = (content.services || []).filter((service) => service.id !== serviceId)
    updateContent({ services: updatedServices })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saving && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Saving...</span>
            </>
          )}
          {lastSaved && !saving && (
            <span className="text-sm text-green-600">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Main Title</Label>
            <Input
              id="heroTitle"
              value={content.heroTitle || ""}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
              placeholder="Your Professional Title"
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={content.heroSubtitle || ""}
              onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
              placeholder="Brief description of your expertise"
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
            <Label htmlFor="aboutTitle">About Title</Label>
            <Input
              id="aboutTitle"
              value={content.aboutTitle || ""}
              onChange={(e) => updateContent({ aboutTitle: e.target.value })}
              placeholder="About Me"
            />
          </div>
          <div>
            <Label htmlFor="aboutContent">About Content</Label>
            <Textarea
              id="aboutContent"
              value={content.aboutContent || ""}
              onChange={(e) => updateContent({ aboutContent: e.target.value })}
              placeholder="Tell your story, experience, and what makes you unique..."
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
          {content.services && content.services.length > 0 ? (
            <div className="space-y-6">
              {content.services.map((service, index) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Service {index + 1}</Badge>
                    <Button onClick={() => removeService(service.id)} variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Service Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, { title: e.target.value })}
                        placeholder="Personal Training"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={service.price}
                        onChange={(e) => updateService(service.id, { price: e.target.value })}
                        placeholder="€50/session"
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
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, { description: e.target.value })}
                        placeholder="Describe this service..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No services added yet. Click "Add Service" to get started.</p>
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
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={content.contactEmail || ""}
              onChange={(e) => updateContent({ contactEmail: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone">Phone</Label>
            <Input
              id="contactPhone"
              value={content.contactPhone || ""}
              onChange={(e) => updateContent({ contactPhone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="contactLocation">Location</Label>
            <Input
              id="contactLocation"
              value={content.contactLocation || ""}
              onChange={(e) => updateContent({ contactLocation: e.target.value })}
              placeholder="City, State"
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
            <Label htmlFor="seoTitle">Page Title</Label>
            <Input
              id="seoTitle"
              value={content.seoTitle || ""}
              onChange={(e) => updateContent({ seoTitle: e.target.value })}
              placeholder="Professional Personal Trainer - Your Name"
            />
          </div>
          <div>
            <Label htmlFor="seoDescription">Meta Description</Label>
            <Textarea
              id="seoDescription"
              value={content.seoDescription || ""}
              onChange={(e) => updateContent({ seoDescription: e.target.value })}
              placeholder="Brief description for search engines..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
