export interface TrainerFormData {
  fullName: string
  email: string
  phone: string
  location: string
  specialty: string
  experience: string
  certifications: string[]
  bio: string
  services: string[]
  pricing: string
  availability: string
  socialMedia: {
    instagram?: string
    facebook?: string
    website?: string
  }
  profileImage?: string
}

// NEW: Extended content interface for editing
export interface EditableTrainerContent {
  // Hero Section
  heroTitle?: string // "Transform Your Body, Transform Your Life"
  heroSubtitle?: string // "Certified Personal Trainer specializing in..."
  heroCallToAction?: string // "Book Your Free Consultation"

  // About Section
  aboutHeading?: string // "About [Name]"
  aboutContent?: string // Bio paragraph
  aboutHighlights?: string[] // ["5+ Years Experience", "200+ Clients Transformed"]

  // Services Section
  servicesHeading?: string // "My Training Services"
  customServices?: Array<{
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
  createdAt: Date
  updatedAt: Date
  activatedAt?: Date
  paymentIntentId?: string

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
export interface TrainerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  status: "pending" | "active" | "inactive"
  createdAt: string
  updatedAt: string
  tempId: string | null
  paymentIntentId: string | null
  content?: TrainerContent
}

// NEW: Trainer Content interface
export interface TrainerContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
  }
  services: Service[]
  contact: {
    title: string
    description: string
    email: string
    phone: string
    location: string
  }
  seo: {
    title: string
    description: string
  }
  version?: number
  lastModified?: string
}

// NEW: Service interface
export interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: string
  featured: boolean
}

// NEW: Temp Trainer Data interface
export interface TempTrainerData {
  tempId: string
  name: string
  email: string
  phone?: string
  location: string
  specialization: string
  experience: string
  bio: string
  certifications: string[]
  createdAt: string
  expiresAt: string
}
