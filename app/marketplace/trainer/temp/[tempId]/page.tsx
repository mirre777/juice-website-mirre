"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"
import TrainerProfileHeader from "@/components/trainer/TrainerProfileHeader"
import type { TrainerData, TrainerContent } from "@/components/trainer/TrainerProfileDisplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock } from 'lucide-react'

interface TempTrainerPageProps {
  params: {
    tempId: string
  }
}

export default function TempTrainerPage({ params }: TempTrainerPageProps) {
  const { tempId } = params
  const [trainer, setTrainer] = useState<TrainerData | null>(null)
  const [content, setContent] = useState<TrainerContent | null>(null)
  const [editingContent, setEditingContent] = useState<TrainerContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const router = useRouter()
  const hasAttemptedActivationRef = useRef(false)

  // Fetch temp trainer data
  useEffect(() => {
    const fetchTempTrainer = async () => {
      try {
        const response = await fetch(`/api/trainer/temp/${tempId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load trainer preview")
        }

        if (data.success && data.trainer) {
          // If already activated, redirect to live trainer page
          if (data.trainer.status === "active") {
            router.push(`/marketplace/trainer/${data.trainer.id}`)
            return
          }

          setTrainer(data.trainer)

          const trainerContent = data.content || generateDefaultContent(data.trainer)
          setContent(trainerContent)
          setEditingContent(trainerContent)

          // Countdown setup
          if (data.trainer.expiresAt) {
            const expiresAt = new Date(data.trainer.expiresAt).getTime()
            const now = Date.now()
            const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
            setTimeLeft(remaining)
          }
        } else {
          throw new Error("Trainer preview not found")
        }
      } catch (err) {
        console.error("Error fetching temp trainer:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainer preview")
      } finally {
        setLoading(false)
      }
    }

    if (tempId) {
      fetchTempTrainer()
    }
  }, [tempId, router])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          // Mark as expired and redirect
          setTimeout(() => {
            router.push("/marketplace/personal-trainer-website")
          }, 3000)
        }
        return Math.max(0, newTime)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, router])

  // Verify payment and attempt activation if user returns to this page after paying.
  useEffect(() => {
    const verifyAndActivate = async () => {
      if (hasAttemptedActivationRef.current) return
      if (!trainer) return

      const paymentIntentId = localStorage.getItem("juice_payment_reference")
      if (!paymentIntentId) return

      setVerifyingPayment(true)
      try {
        // 1) Verify payment status server-side (read-only)
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        })
        const verifyData = await verifyRes.json()

        if (verifyRes.ok && verifyData?.success) {
          // 2) If payment succeeded but trainer still temp, call activate (idempotent)
          if (trainer.status !== "active") {
            const activateRes = await fetch("/api/trainer/activate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentIntentId }),
            })
            const activateData = await activateRes.json()
            if (activateRes.ok && activateData?.success) {
              localStorage.removeItem("juice_payment_reference")
              hasAttemptedActivationRef.current = true
              router.replace(`/marketplace/trainer/${activateData.trainerId}`)
              return
            }
          }
        }
      } catch (e) {
        console.error("Temp page verify/activate error:", e)
      } finally {
        setVerifyingPayment(false)
      }
    }

    verifyAndActivate()
  }, [trainer, router])

  // Generate default content for new trainers
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
      services:
        trainerData.services?.map((service: string, index: number) => ({
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
        title: "Let's Start Your Fitness Journey",
        description:
          "Ready to transform your fitness? Get in touch to schedule your first session or ask any questions.",
        email: trainerData.email,
        phone: trainerData.phone || "",
        location: location,
      },
    }
  }

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "Expired"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditingContent({ ...content! })
  }

  const handleContentChange = (updatedContent: TrainerContent) => {
    setEditingContent(updatedContent)
  }

  const handleSave = async () => {
    if (!editingContent || !trainer) return

    setSaving(true)
    try {
      const response = await fetch(`/api/trainer/temp/${tempId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.redirectTo) {
          router.push(data.redirectTo)
          return
        }
        throw new Error(data.error || "Failed to save changes")
      }

      setContent(editingContent)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      console.error("Error saving changes:", err)
      setError(err instanceof Error ? err.message : "Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingContent(content)
    setIsEditing(false)
  }

  const handleActivate = () => {
    // Persist temp trainer data for payment flow
    sessionStorage.setItem("tempTrainerData", JSON.stringify(trainer))
    sessionStorage.setItem("tempTrainerToken", tempId)

    // Redirect to payment page; Payment page will use trainerId=tempId
    router.push(`/payment?plan=trainer&tempId=${tempId}`)
  }

  const handleBookConsultation = () => {
    alert("This is a preview! Activate your profile to enable client bookings.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trainer preview...</p>
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
              <h2 className="text-xl font-semibold mb-2">Preview Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || "This trainer preview has expired or doesn't exist."}</p>
              <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = timeLeft <= 0
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Preview Expired</h2>
              <p className="text-muted-foreground mb-4">This trainer preview has expired. Create a new profile to get started.</p>
              <Button onClick={() => router.push("/marketplace/personal-trainer-website")}>Create New Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasUnsavedChanges = isEditing && JSON.stringify(content) !== JSON.stringify(editingContent)

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerProfileHeader
        mode="temp"
        timeLeft={formatTimeLeft(timeLeft)}
        onActivate={handleActivate}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={isEditing}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        activationPrice="€70"
      />

      {verifyingPayment && (
        <div className="bg-yellow-100 text-yellow-800 text-sm py-2 px-4 text-center">
          Verifying your recent payment... If successful, we&apos;ll activate your profile automatically.
        </div>
      )}

      <TrainerProfileDisplay
        trainer={trainer}
        content={content}
        editingContent={editingContent}
        mode="temp-edit"
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onContentChange={handleContentChange}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onBookConsultation={handleBookConsultation}
        onActivate={handleActivate}
        timeLeft={formatTimeLeft(timeLeft)}
        isExpired={isExpired}
        activationPrice="€70"
      />
    </div>
  )
}
