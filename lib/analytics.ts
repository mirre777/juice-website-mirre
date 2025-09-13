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
  | "form_abandon"
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

  formStart: (formName: string, location?: string) =>
    trackEvent("form_start", {
      event_category: "form_interaction",
      event_label: formName,
      form_name: formName,
      form_location: location,
    }),

  formAbandon: (formName: string, fieldName?: string) =>
    trackEvent("form_abandon", {
      event_category: "form_interaction",
      event_label: formName,
      form_name: formName,
      abandoned_field: fieldName,
    }),

  ctaClick: (ctaText: string, location?: string) =>
    trackEvent("cta_click", {
      event_category: "engagement",
      event_label: ctaText,
      cta_text: ctaText,
      cta_location: location,
    }),

  scrollDepth: (percentage: 25 | 50 | 75 | 100, page?: string) =>
    trackEvent("scroll_depth", {
      event_category: "engagement",
      event_label: `${percentage}%`,
      scroll_percentage: percentage,
      page_path: page || window.location.pathname,
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
