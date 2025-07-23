export interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

export interface TrainerContent {
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
  seo?: {
    title: string
    description: string
  }
}

export interface TrainerDisplayData {
  id: string
  fullName: string
  email: string
  experience?: string
  specialty: string
  certifications?: string
  services?: string[]
  status: string
  isActive?: boolean
  isPaid?: boolean
  content?: TrainerContent
  // Additional fields for temp trainers
  phone?: string
  location?: string
  bio?: string
  city?: string
  district?: string
}

export type TrainerDisplayMode = "live" | "temp" | "preview"
