"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TrainerProfileDisplay, {
  type DisplayTrainerData,
  type DisplayTrainerContent,
} from "@/components/trainer/TrainerProfileDisplay"

interface TrainerData {
  id: string
  fullName: string
  email: string
  phone?: string
  location: string
  specialty: string
  experience: string
  bio: string
  certifications?: string
  services: string[]
  status: string
  createdAt: string
  expiresAt?: string
  sessionToken?: string
}

interface TempTrainerPageProps {
  trainer: TrainerData
  token?: string
}

export default function TempTrainerPage({ trainer, token }: TempTrainerPageProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  // Countdown timer
  useEffect(() => {
    const expiryTime = trainer?.expiresAt
      ? new Date(trainer.expiresAt).getTime()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).getTime() // 24 hours from now if no expiry set

    const updateCountdown = () => {
      try {
        const now = new Date().getTime()
        const difference = expiryTime - now

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
          setIsExpired(false)
        } else {
          setTimeLeft("Expired")
          setIsExpired(true)
        }
      } catch (error) {
        console.error("Error calculating countdown:", error)
        setTimeLeft("--")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [trainer?.expiresAt])

  // Map temp trainer data to display format
  const displayTrainer: DisplayTrainerData = {
    id: trainer?.id || "",
    fullName: trainer?.fullName || "Personal Trainer",
    email: trainer?.email || "",
    phone: trainer?.phone,
    city: trainer?.location?.split(",")[0]?.trim() || "Location",
    district: trainer?.location?.split(",")[1]?.trim() || "",
    specialty: trainer?.specialty || "Fitness Training",
    bio: trainer?.bio || "",
    certifications: trainer?.certifications,
    services: trainer?.services || [],
    profileImage: undefined, // Temp profiles don't have images yet
    status: trainer?.status || "temp",
    isActive: false,
    isPaid: false,
  }

  // Create content structure for temp trainer
  const displayContent: DisplayTrainerContent = {
    hero: {
      title: `Transform Your Fitness with ${trainer?.fullName || "Professional Training"}`,
      subtitle: `Professional ${trainer?.specialty || "Fitness"} Trainer`,
      description:
        trainer?.bio ||
        "Professional fitness training services tailored to your goals. Get started with a free consultation to discuss your fitness journey.",
    },
    about: {
      title: "About Me",
      bio:
        trainer?.bio ||
        "Professional trainer dedicated to helping clients achieve their fitness goals through personalized training programs and expert guidance.",
    },
    contact: {
      title: "Let's Start Your Fitness Journey",
      description:
        "Ready to transform your fitness? Get in touch to schedule your free consultation and take the first step towards your goals.",
      phone: trainer?.phone || "",
      email: trainer?.email || "",
      location: trainer?.location || "Available Online",
    },
    services: trainer?.services?.map((service, index) => ({
      id: `service-${index}`,
      title: service,
      description: `Professional ${service.toLowerCase()} tailored to your fitness goals and experience level.`,
      price: index === 0 ? 80 : 60, // First service featured at higher price
      duration: "60 minutes",
      featured: index === 0,
    })) || [
      {
        id: "consultation",
        title: "Free Consultation",
        description: "Initial assessment and goal-setting session to create your personalized fitness plan.",
        price: 0,
        duration: "30 minutes",
        featured: true,
      },
      {
        id: "personal-training",
        title: "Personal Training Session",
        description: "One-on-one training session focused on your specific goals and fitness level.",
        price: 80,
        duration: "60 minutes",
        featured: false,
      },
    ],
  }

  // Event handlers
  const handleActivate = () => {
    if (trainer?.id) {
      router.push(`/payment?tempId=${trainer.id}${token ? `&token=${encodeURIComponent(token)}` : ""}`)
    }
  }

  const handleBookConsultation = () => {
    // For temp mode, this should lead to activation
    handleActivate()
  }

  const handleScheduleSession = () => {
    // For temp mode, this should also lead to activation
    handleActivate()
  }

  const handleSendMessage = () => {
    // For temp mode, this should also lead to activation
    handleActivate()
  }

  return (
    <TrainerProfileDisplay
      trainer={displayTrainer}
      content={displayContent}
      mode="temp"
      onBookConsultation={handleBookConsultation}
      onScheduleSession={handleScheduleSession}
      onSendMessage={handleSendMessage}
      onActivate={handleActivate}
      timeLeft={timeLeft}
      isExpired={isExpired}
      activationPrice="€70"
    />
  )
}
