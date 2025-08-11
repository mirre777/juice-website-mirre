"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"
import TrainerProfileHeader from "@/components/trainer/TrainerProfileHeader"
import type { TrainerData, TrainerContent } from "@/components/trainer/TrainerProfileDisplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export default function TrainerPage({ params }: PageProps) {
  const { id } = params
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [editingContent, setEditingContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPublicView, setIsPublicView] = useState(false)
  const router = useRouter()

  // Fetch live trainer data
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/content/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load trainer profile")
        }

        if (data.success && data.trainer) {
          setTrainer(data.trainer)

          // Use existing content or generate default
          const trainerContent = data.content || generateDefaultContent(data.trainer)
          setContent(trainerContent)
          setEditingContent(trainerContent)
        } else {
          throw new Error("Trainer profile not found")
        }
      } catch (err) {
        console.error("Error fetching trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer profile")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTrainer()
    }
  }, [id])

  // Generate default content for trainers without content
  const generateDefaultContent = (trainerData: any): TrainerContent => {
    const location =
      trainerData.city && trainerData.district
        ? `${trainerData.city}, ${trainerData.district}`
        : trainerData.location || "Location not specified"

    return {
      hero: {
        title: `Transform Your Fitness with ${trainerData.fullName}`,
        subtitle: `Professional ${trainerData.specialty} trainer in ${location}`,
        description:
          trainerData.bio ||
          "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
      },
      about: {
        title: `About ${trainerData.fullName}`,
        bio:
          trainerData.bio ||
          "Experienced personal trainer dedicated to helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
      },
      services: trainerData.services?.map((service: string, index: number) => ({
        id: String(index + 1),
        title: service,
        description: `Professional ${service.toLowerCase()} sessions tailored to your goals`,
        price: 60,
        duration: "60 minutes",
        featured: index === 0,
      })) || [
        {
          id: "1",
          title: "Personal Training",
          description: "Personalized training sessions tailored to your goals",
          price: 60,
          duration: "60 minutes",
          featured: true,
        },
      ],
      contact: {
        title: "Ready to Start Your Fitness Journey?",
        description: "Get in touch to schedule your first session or ask any questions.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        location: location,
      },
    }
  }

  // Handle edit mode
  const handleEdit = () => {
    setIsEditing(true)
    setEditingContent({ ...content! })
  }

  // Handle content changes
  const handleContentChange = (updatedContent: TrainerContent) => {
    setEditingContent(updatedContent)
  }

  // Save changes
  const handleSave = async () => {
    if (!editingContent || !trainer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to save changes")
      }

      setContent(editingContent)
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving changes:", err)
      setError("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Cancel changes
  const handleCancel = () => {
    setEditingContent(content)
    setIsEditing(false)
  }

  // Toggle public view
  const handleViewLive = () => {
    setIsPublicView(true)
  }

  const handleExitLiveView = () => {
    setIsPublicView(false)
  }

  // Handle booking actions
  const handleScheduleSession = () => {
    // TODO: Implement booking system
    alert("Booking system coming soon!")
  }

  const handleSendMessage = () => {
    // TODO: Implement messaging system
    alert("Messaging system coming soon!")
  }

  const handleBookConsultation = () => {
    // TODO: Implement consultation booking
    alert("Consultation booking coming soon!")
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

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-4">
                {error || "This trainer profile doesn't exist or is not accessible."}
              </p>
              <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Public view mode
  if (isPublicView) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Exit live view button */}
        <div className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              <span className="font-medium">Live View - This is how visitors see your profile</span>
            </div>
            <Button variant="secondary" onClick={handleExitLiveView}>
              <EyeOff className="w-4 h-4 mr-2" />
              Exit Live View
            </Button>
          </div>
        </div>

        {/* Public display */}
        <TrainerProfileDisplay
          trainer={trainer}
          content={content}
          mode="public"
          onBookConsultation={handleBookConsultation}
          onScheduleSession={handleScheduleSession}
          onSendMessage={handleSendMessage}
        />
      </div>
    )
  }

  const hasUnsavedChanges = isEditing && JSON.stringify(content) !== JSON.stringify(editingContent)

  // Edit mode
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with live-specific controls */}
      <TrainerProfileHeader
        mode="live"
        onViewLive={handleViewLive}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={isEditing}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
      />

      {/* Main display component */}
      <TrainerProfileDisplay
        trainer={trainer}
        content={content}
        editingContent={editingContent}
        mode="live-edit"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onContentChange={handleContentChange}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onBookConsultation={handleBookConsultation}
        onScheduleSession={handleScheduleSession}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
