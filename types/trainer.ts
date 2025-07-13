import type { Timestamp } from "firebase/firestore"

export interface TrainerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  experience: string
  location: string
  bio: string
  certifications: string
}

// NEW: Extended content interface for editing
export interface EditableTrainerContent {
  // Hero Section
  heroTitle?: string // "Transform Your Body, Transform Your Life"
  heroSubtitle?: string // "Certified Personal Trainer specializing in..."
  heroCallToAction?: string // "Book Your Free Consultation"

  // About Section
  aboutTitle?: string // "About [Name]"
  aboutDescription?: string // Bio paragraph
  aboutHighlights?: string[] // ["5+ Years Experience", "200+ Clients Transformed"]

  // Services Section
  servicesHeading?: string // "My Training Services"
  customServices?: Array<{
    title: string // "Personal Training"
    description: string // "One-on-one customized workouts"
    price?: number // "€80/session"
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
  lastUpdated: Date
  version: number
  isDraft: boolean
}

// EXTENDED: Main trainer document with new fields
export interface TrainerDocument extends TrainerFormData {
  id: string
  tempId?: string
  status: "temp" | "pending_payment" | "active"
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
  services?: any[] // Declare Service type or import it
  contactTitle?: string
  contactContent?: string
  seoTitle?: string
  seoDescription?: string
  contentVersion?: number
  lastContentUpdate?: Timestamp
}

export interface TrainerData extends TrainerContent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  specialization: string
  experience: string
  certifications: string
  bio: string
  status: "temp" | "active"
  tempId?: string
  paymentIntentId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Trainer extends TrainerFormData {
  id: string
  status: "pending" | "active" | "inactive"
  createdAt: string
  updatedAt: string
  activatedAt?: string
  paymentIntentId?: string
  content?: TrainerContent
}

// Declare Service type if not imported
interface Service {
  title: string
  description: string
  price?: number
  duration?: string
}
