import type { Timestamp } from "firebase/firestore"

export interface TrainerFormData {
  name: string
  email: string
  specialization: string
  experience: string
  location: string
  bio: string
}

// NEW: Extended content interface for editing
export interface EditableTrainerContent {
  // Hero Section
  heroTitle?: string // "Transform Your Body, Transform Your Life"
  heroSubtitle?: string // "Certified Personal Trainer specializing in..."
  heroDescription?: string // Additional description for hero section

  // About Section
  aboutTitle?: string // "About [Name]"
  aboutDescription?: string // Bio paragraph
  aboutHighlights?: string[] // ["5+ Years Experience", "200+ Clients Transformed"]

  // Services Section
  servicesHeading?: string // "My Training Services"
  customServices?: Array<{
    id: string
    title: string // "Personal Training"
    description: string // "One-on-one customized workouts"
    price?: string // "€80/session"
    duration?: string // "60 minutes"
  }>

  // Testimonials Section
  testimonialsHeading?: string // "What My Clients Say"
  testimonials?: Array<{
    name: string
    text: string
    rating: number
  }>

  // Contact Section
  contactHeading?: string // "Ready to Start Your Journey?"
  contactSubtext?: string // "Get in touch to schedule your consultation"
  contactEmail?: string // Trainer's email for contact
  contactPhone?: string // Trainer's phone number for contact
  contactLocation?: string // Trainer's location for contact
  contactAvailability?: string // Availability information for contact

  // Styling Options
  primaryColor?: string // "#D2FF28" (brand color)
  secondaryColor?: string // Custom accent color
  fontStyle?: "modern" | "classic" | "bold"
  layoutStyle?: "minimal" | "dynamic" | "professional"
}

// NEW: Website settings interface
export interface TrainerWebsiteSettings {
  isPublished: boolean
  customDomain?: string
  seoTitle?: string
  seoDescription?: string
}

// NEW: Customization metadata
export interface TrainerCustomization {
  lastUpdated: Timestamp
  version: number
  isDraft: boolean
}

// EXTENDED: Main trainer document with new fields
export interface TrainerDocument extends TrainerFormData {
  id: string
  tempId?: string
  status: "pending" | "active" | "inactive"
  createdAt: Timestamp
  updatedAt: Timestamp
  activatedAt?: Timestamp
  stripePaymentIntentId?: string

  // NEW: Editable content
  content?: EditableTrainerContent

  // NEW: Customization settings
  customization?: TrainerCustomization

  // NEW: Website settings
  settings?: TrainerWebsiteSettings
}

export interface TrainerSessionData {
  tempId: string
  trainerData: TrainerFormData
  expiresAt: string
  isValid: boolean
}

// NEW: Interface for content updates
export interface ContentUpdateRequest {
  section: string
  field: string
  value: any
  trainerId: string
}

// NEW: Interface for trainer dashboard data
export interface TrainerDashboardData extends TrainerDocument {
  websiteUrl: string
  lastUpdated?: Date
  totalViews?: number
  isContentComplete: boolean
}

export interface TrainerCreationResponse {
  success: boolean
  tempId?: string
  error?: string
}

export interface TrainerActivationResponse {
  success: boolean
  trainerId?: string
  error?: string
}

// NEW: Trainer Profile interface
export interface TrainerProfile extends TrainerFormData {
  content?: TrainerContent
}

export interface TrainerContent {
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
  version?: number
  lastModified?: Timestamp
}

export interface Trainer {
  id: string
  name: string
  email: string
  specialization: string
  experience: string
  location: string
  bio: string
  status: "active" | "pending" | "inactive"
  tempId?: string
  paymentIntentId?: string
  content?: TrainerContent
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Declare Service type if not imported
export interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: string
}

export interface TempTrainer {
  id: string
  formData: TrainerFormData
  paymentIntentId?: string
  createdAt: Timestamp
  expiresAt: Timestamp
}
