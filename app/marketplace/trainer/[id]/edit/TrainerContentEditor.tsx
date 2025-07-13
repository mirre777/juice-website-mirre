"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import type { TrainerContent, Service } from "@/types/trainer"

interface TrainerContentEditorProps {
  trainerId: string
}

export default function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        toast({
          title: "Error",
          description: "Failed to load trainer content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching trainer content:", error)
      toast({
        title: "Error",
        description: "Failed to load trainer content",
        variant: "destructive",
      })
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
        toast({
          title: "Success",
          description: "Content saved successfully",
        })
      } else {
        throw new Error("Failed to save content")
      }
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600">Unable to load trainer content for editing.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
            <p className="text-gray-600">Customize your trainer profile content</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
              <Input
                value={content.heroTitle || ""}
                onChange={(e) => updateContent("heroTitle", e.target.value)}
                placeholder="Your main headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <Textarea
                value={content.heroSubtitle || ""}
                onChange={(e) => updateContent("heroSubtitle", e.target.value)}
                placeholder="Your subtitle or tagline"
                rows={2}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">About Title</label>
              <Input
                value={content.aboutTitle || ""}
                onChange={(e) => updateContent("aboutTitle", e.target.value)}
                placeholder="About section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
              <Textarea
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
            {content.services && content.services.length > 0 ? (
              <div className="space-y-4">
                {content.services.map((service, index) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">Service {index + 1}</Badge>
                      <Button onClick={() => removeService(service.id)} variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                        <Input
                          value={service.title}
                          onChange={(e) => updateService(service.id, "title", e.target.value)}
                          placeholder="Service name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <Input
                          value={service.duration}
                          onChange={(e) => updateService(service.id, "duration", e.target.value)}
                          placeholder="e.g., 60 minutes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price (€)</label>
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateService(service.id, "price", Number.parseInt(e.target.value) || 0)}
                          placeholder="Price"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Title</label>
              <Input
                value={content.contactTitle || ""}
                onChange={(e) => updateContent("contactTitle", e.target.value)}
                placeholder="Contact section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Message</label>
              <Textarea
                value={content.contactMessage || ""}
                onChange={(e) => updateContent("contactMessage", e.target.value)}
                placeholder="Your contact message or call-to-action"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
              <Input
                value={content.seoTitle || ""}
                onChange={(e) => updateContent("seoTitle", e.target.value)}
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
              <Textarea
                value={content.seoDescription || ""}
                onChange={(e) => updateContent("seoDescription", e.target.value)}
                placeholder="Page description for search engines"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
