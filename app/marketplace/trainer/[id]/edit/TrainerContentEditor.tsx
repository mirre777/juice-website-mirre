"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { TrainerContent, Service } from "@/types/trainer"

interface TrainerContentEditorProps {
  trainerId: string
}

export function TrainerContentEditor({ trainerId }: TrainerContentEditorProps) {
  const router = useRouter()
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
        toast.error("Failed to load trainer content")
      }
    } catch (error) {
      console.error("Error fetching trainer content:", error)
      toast.error("Failed to load trainer content")
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
        toast.success("Content saved successfully!")
      } else {
        toast.error("Failed to save content")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save content")
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
      title: "",
      description: "",
      price: "",
      duration: "",
    }
    updateContent("services", [...(content.services || []), newService])
  }

  const updateService = (serviceId: string, field: keyof Service, value: string) => {
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
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Trainer not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/trainer/${trainerId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Edit Content</h1>
        </div>
        <Button onClick={saveContent} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
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
              <Label htmlFor="heroTitle">Title</Label>
              <Input
                id="heroTitle"
                value={content.heroTitle || ""}
                onChange={(e) => updateContent("heroTitle", e.target.value)}
                placeholder="Your main headline"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Textarea
                id="heroSubtitle"
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
              <Label htmlFor="aboutTitle">About Title</Label>
              <Input
                id="aboutTitle"
                value={content.aboutTitle || ""}
                onChange={(e) => updateContent("aboutTitle", e.target.value)}
                placeholder="About section title"
              />
            </div>
            <div>
              <Label htmlFor="aboutContent">About Content</Label>
              <Textarea
                id="aboutContent"
                value={content.aboutContent || ""}
                onChange={(e) => updateContent("aboutContent", e.target.value)}
                placeholder="Tell your story and share your expertise"
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
          <CardContent className="space-y-6">
            {content.services?.map((service, index) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Service {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeService(service.id)}>
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
                    <Label>Price</Label>
                    <Input
                      value={service.price}
                      onChange={(e) => updateService(service.id, "price", e.target.value)}
                      placeholder="€50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, "description", e.target.value)}
                      placeholder="Describe this service"
                      rows={3}
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
                </div>
              </div>
            ))}
            {(!content.services || content.services.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No services added yet. Click "Add Service" to get started.
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
              <Label htmlFor="contactTitle">Contact Title</Label>
              <Input
                id="contactTitle"
                value={content.contactTitle || ""}
                onChange={(e) => updateContent("contactTitle", e.target.value)}
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <Label htmlFor="contactContent">Contact Content</Label>
              <Textarea
                id="contactContent"
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
              <Label htmlFor="seoTitle">Page Title</Label>
              <Input
                id="seoTitle"
                value={content.seoTitle || ""}
                onChange={(e) => updateContent("seoTitle", e.target.value)}
                placeholder="SEO title for search engines"
              />
            </div>
            <div>
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                value={content.seoDescription || ""}
                onChange={(e) => updateContent("seoDescription", e.target.value)}
                placeholder="Brief description for search results"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button onClick={saveContent} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
