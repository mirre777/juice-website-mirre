// Google Analytics utility functions with TypeScript support
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Analytics event types for type safety
export type AnalyticsEvent =
  | "page_view"
  | "sign_up"
  | "purchase"
  | "download_app"
  | "join_waitlist"
  | "contact_trainer"
  | "view_pricing"
  | "start_workout"
  | "complete_workout"
  | "app_store_click"
  | "form_start"
  | "form_step_complete"
  | "form_field_focus"
  | "form_field_blur"
  | "form_validation_error"
  | "form_abandon"
  | "form_submit_attempt"
  | "form_submit_success"
  | "form_submit_error"
  | "scroll_depth"
  | "cta_click"

export interface AnalyticsEventParams {
  event_category?: string
  event_label?: string
  value?: number
  currency?: string
  [key: string]: any
}

export interface UserProperties {
  user_type?: "client" | "trainer" | "unknown"
  landing_page_source?: string
  device_type?: "mobile" | "tablet" | "desktop"
  screen_size?: string
  geographic_location?: string
  session_id?: string
}

// Get GA tracking ID from environment
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-2N948XX72T"

// Check if we should load analytics (production only)
export const shouldLoadAnalytics = (): boolean => {
  return process.env.NODE_ENV === "production" && !!GA_TRACKING_ID
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (!shouldLoadAnalytics()) {
    console.log("[Analytics] Skipping GA initialization in development")
    return
  }

  // Check if user has consented (for GDPR compliance)
  const hasConsent = getAnalyticsConsent()

  if (hasConsent) {
    window.gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
    console.log("[Analytics] GA initialized with consent")
  } else {
    console.log("[Analytics] GA not initialized - no consent")
  }
}

export const trackEvent = (event: AnalyticsEvent, parameters: AnalyticsEventParams = {}): void => {
  if (!shouldLoadAnalytics() || !getAnalyticsConsent()) {
    console.log(`[Analytics] Skipping event: ${event}`)
    return
  }

  try {
    // Get user properties automatically
    const userProperties = getUserProperties()

    // Merge user properties with event parameters
    const enhancedParams = {
      event_category: parameters.event_category || "engagement",
      event_label: parameters.event_label,
      value: parameters.value,
      ...userProperties,
      ...parameters, // Event-specific params override user properties
    }

    window.gtag("event", event, enhancedParams)
    console.log(`[Analytics] Enhanced event tracked: ${event}`, enhancedParams)
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error)
  }
}

export const trackPageView = (url: string, title?: string): void => {
  if (!shouldLoadAnalytics() || !getAnalyticsConsent()) {
    return
  }

  try {
    const userProperties = getUserProperties()

    window.gtag("config", GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
      custom_map: {
        custom_parameter_1: "user_type",
        custom_parameter_2: "device_type",
        custom_parameter_3: "landing_page_source",
      },
      ...userProperties,
    })
    console.log(`[Analytics] Enhanced page view tracked: ${url}`, userProperties)
  } catch (error) {
    console.error("[Analytics] Error tracking page view:", error)
  }
}

// GDPR Compliance functions
export const getAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics_consent")
  return consent === "granted"
}

export const setAnalyticsConsent = (granted: boolean): void => {
  if (typeof window === "undefined") return

  localStorage.setItem("analytics_consent", granted ? "granted" : "denied")

  if (granted) {
    // Initialize GA if consent is granted
    initGA()
  } else {
    // Disable GA if consent is revoked
    window[`ga-disable-${GA_TRACKING_ID}`] = true
  }
}

// Check if user needs to see consent banner
export const needsConsentBanner = (): boolean => {
  if (typeof window === "undefined") return false

  const consent = localStorage.getItem("analytics_consent")
  console.log("[Analytics] Current consent value:", consent)
  return consent === null // Show banner if no preference set
}

export const getUserProperties = (): UserProperties => {
  if (typeof window === "undefined") return {}

  const properties: UserProperties = {}

  // Detect device type based on screen width
  const width = window.innerWidth
  if (width < 768) {
    properties.device_type = "mobile"
  } else if (width < 1024) {
    properties.device_type = "tablet"
  } else {
    properties.device_type = "desktop"
  }

  // Screen size
  properties.screen_size = `${window.innerWidth}x${window.innerHeight}`

  // Landing page source (from referrer or URL params)
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get("utm_source")
  const referrer = document.referrer

  if (utmSource) {
    properties.landing_page_source = utmSource
  } else if (referrer) {
    try {
      const referrerDomain = new URL(referrer).hostname
      properties.landing_page_source = referrerDomain
    } catch {
      properties.landing_page_source = "direct"
    }
  } else {
    properties.landing_page_source = "direct"
  }

  // Try to detect user type from URL path
  const path = window.location.pathname
  if (path.includes("getclients") || path.includes("trainer")) {
    properties.user_type = "trainer"
  } else if (path.includes("findatrainer") || path.includes("workout")) {
    properties.user_type = "client"
  } else {
    properties.user_type = "unknown"
  }

  // Geographic location (basic timezone detection)
  try {
    properties.geographic_location = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    properties.geographic_location = "unknown"
  }

  // Session ID (create if doesn't exist)
  let sessionId = sessionStorage.getItem("analytics_session_id")
  if (!sessionId) {
    sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("analytics_session_id", sessionId)
  }
  properties.session_id = sessionId

  return properties
}

// Utility functions for common tracking events
export const analytics = {
  // User actions
  signUp: (method?: string) => trackEvent("sign_up", { event_category: "user", event_label: method }),
  joinWaitlist: (formLocation?: string) =>
    trackEvent("join_waitlist", {
      event_category: "conversion",
      event_label: formLocation,
      form_location: formLocation,
    }),
  contactTrainer: () => trackEvent("contact_trainer", { event_category: "engagement" }),

  // App interactions
  downloadApp: (platform?: string) => trackEvent("download_app", { event_category: "app", event_label: platform }),
  viewPricing: () => trackEvent("view_pricing", { event_category: "engagement" }),

  appStoreClick: (store: "app_store" | "play_store", location?: string) =>
    trackEvent("app_store_click", {
      event_category: "app_download",
      event_label: store,
      store_type: store,
      click_location: location,
    }),

  // Workout tracking
  startWorkout: (workoutType?: string) =>
    trackEvent("start_workout", { event_category: "fitness", event_label: workoutType }),
  completeWorkout: (workoutType?: string, duration?: number) =>
    trackEvent("complete_workout", { event_category: "fitness", event_label: workoutType, value: duration }),

  // Purchase tracking
  purchase: (value: number, currency = "USD", itemId?: string) =>
    trackEvent("purchase", { event_category: "ecommerce", value, currency, event_label: itemId }),
}

export const formAnalytics = {
  // Multi-step form tracking
  formStart: (formName: string, location?: string, totalSteps?: number) =>
    trackEvent("form_start", {
      event_category: "form_interaction",
      event_label: formName,
      form_name: formName,
      form_location: location,
      total_steps: totalSteps,
      form_progress: 0,
    }),

  stepComplete: (formName: string, stepNumber: number, stepName: string, totalSteps?: number) =>
    trackEvent("form_step_complete", {
      event_category: "form_interaction",
      event_label: `${formName}_step_${stepNumber}`,
      form_name: formName,
      step_number: stepNumber,
      step_name: stepName,
      total_steps: totalSteps,
      form_progress: totalSteps ? Math.round((stepNumber / totalSteps) * 100) : undefined,
    }),

  fieldFocus: (formName: string, fieldName: string, fieldType?: string) =>
    trackEvent("form_field_focus", {
      event_category: "form_interaction",
      event_label: `${formName}_${fieldName}`,
      form_name: formName,
      field_name: fieldName,
      field_type: fieldType,
    }),

  fieldBlur: (formName: string, fieldName: string, hasValue: boolean, timeSpent?: number) =>
    trackEvent("form_field_blur", {
      event_category: "form_interaction",
      event_label: `${formName}_${fieldName}`,
      form_name: formName,
      field_name: fieldName,
      field_completed: hasValue,
      time_spent_seconds: timeSpent,
    }),

  validationError: (formName: string, fieldName: string, errorMessage: string, stepNumber?: number) =>
    trackEvent("form_validation_error", {
      event_category: "form_interaction",
      event_label: `${formName}_${fieldName}_error`,
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage,
      step_number: stepNumber,
    }),

  formAbandon: (formName: string, stepNumber?: number, stepName?: string, completionTime?: number) =>
    trackEvent("form_abandon", {
      event_category: "form_interaction",
      event_label: `${formName}_abandon_step_${stepNumber}`,
      form_name: formName,
      step_number: stepNumber,
      step_name: stepName,
      completion_time_seconds: completionTime,
      form_progress: stepNumber && formName.includes("trainer") ? Math.round((stepNumber / 6) * 100) : undefined,
    }),

  submitAttempt: (formName: string, stepNumber?: number) =>
    trackEvent("form_submit_attempt", {
      event_category: "form_interaction",
      event_label: formName,
      form_name: formName,
      step_number: stepNumber,
    }),

  submitSuccess: (formName: string, completionTime?: number, leadQualityScore?: number) =>
    trackEvent("form_submit_success", {
      event_category: "conversion",
      event_label: formName,
      form_name: formName,
      completion_time_seconds: completionTime,
      lead_quality_score: leadQualityScore,
      value: leadQualityScore, // For GA4 conversion value
    }),

  submitError: (formName: string, errorMessage: string, stepNumber?: number) =>
    trackEvent("form_submit_error", {
      event_category: "form_interaction",
      event_label: `${formName}_error`,
      form_name: formName,
      error_message: errorMessage,
      step_number: stepNumber,
    }),
}

export const calculateLeadQualityScore = (formData: any, userProperties: UserProperties): number => {
  let score = 50 // Base score

  // Landing page source scoring
  if (userProperties.landing_page_source === "google" || userProperties.landing_page_source?.includes("google")) {
    score += 20 // Organic search traffic is high quality
  } else if (userProperties.landing_page_source === "direct") {
    score += 15 // Direct traffic is good quality
  } else if (
    userProperties.landing_page_source?.includes("facebook") ||
    userProperties.landing_page_source?.includes("instagram")
  ) {
    score += 10 // Social media traffic
  }

  // Device type scoring
  if (userProperties.device_type === "desktop") {
    score += 10 // Desktop users tend to be more engaged
  } else if (userProperties.device_type === "tablet") {
    score += 5
  }

  // Form completion scoring
  if (formData.phone && formData.phone.length > 5) {
    score += 15 // Phone number indicates serious interest
  }
  if (formData.message && formData.message.length > 20) {
    score += 10 // Detailed message indicates engagement
  }
  if (formData.bio && formData.bio.length > 50) {
    score += 15 // Detailed bio for trainers
  }

  // Geographic location scoring (European markets)
  if (
    userProperties.geographic_location?.includes("Europe") ||
    userProperties.geographic_location?.includes("Amsterdam") ||
    userProperties.geographic_location?.includes("Vienna")
  ) {
    score += 10 // Target markets
  }

  // Time-based scoring (session engagement)
  const sessionDuration = Date.now() - Number.parseInt(userProperties.session_id?.split("_")[0] || "0")
  if (sessionDuration > 120000) {
    // More than 2 minutes
    score += 10
  } else if (sessionDuration > 60000) {
    // More than 1 minute
    score += 5
  }

  return Math.min(100, Math.max(0, score)) // Clamp between 0-100
}
