"use client"

import TrainerProfileDisplay from "@/components/trainer/TrainerProfileDisplay"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    bio: string
  }
  contact: {
    title: string
    description: string
    phone: string
    email: string
    location: string
  }
  services: Service[]
}

interface TrainerData {
  id: string
  fullName: string
  email: string
  experience: string
  specialty: string
  certifications?: string
  services: string[]
  status: string
  isActive: boolean
  isPaid: boolean
  content?: TrainerContent
}

interface PublicTrainerViewProps {
  trainer: TrainerData
  content: TrainerContent
  onExitPublicView: () => void
}

export default function PublicTrainerView({ trainer, content, onExitPublicView }: PublicTrainerViewProps) {
  return (
    <TrainerProfileDisplay
      trainer={trainer}
      content={content}
      mode="preview"
      onExitPreview={onExitPublicView}
      showHeader={false}
    />
  )
}
