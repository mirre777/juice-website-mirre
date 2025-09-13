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

export interface AnalyticsEventParams {
  event_category?: string
  event_label?: string
  value?: number
  currency?: string
  [key: string]: any
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

// Track custom events with type safety
export const trackEvent = (event: AnalyticsEvent, parameters: AnalyticsEventParams = {}): void => {
  if (!shouldLoadAnalytics() || !getAnalyticsConsent()) {
    console.log(`[Analytics] Skipping event: ${event}`)
    return
  }

  try {
    window.gtag("event", event, {
      event_category: parameters.event_category || "engagement",
      event_label: parameters.event_label,
      value: parameters.value,
      ...parameters,
    })
    console.log(`[Analytics] Event tracked: ${event}`, parameters)
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error)
  }
}

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!shouldLoadAnalytics() || !getAnalyticsConsent()) {
    return
  }

  try {
    window.gtag("config", GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
    })
    console.log(`[Analytics] Page view tracked: ${url}`)
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

// Utility functions for common tracking events
export const analytics = {
  // User actions
  signUp: (method?: string) => trackEvent("sign_up", { event_category: "user", event_label: method }),
  joinWaitlist: () => trackEvent("join_waitlist", { event_category: "conversion" }),
  contactTrainer: () => trackEvent("contact_trainer", { event_category: "engagement" }),

  // App interactions
  downloadApp: (platform?: string) => trackEvent("download_app", { event_category: "app", event_label: platform }),
  viewPricing: () => trackEvent("view_pricing", { event_category: "engagement" }),

  // Workout tracking
  startWorkout: (workoutType?: string) =>
    trackEvent("start_workout", { event_category: "fitness", event_label: workoutType }),
  completeWorkout: (workoutType?: string, duration?: number) =>
    trackEvent("complete_workout", { event_category: "fitness", event_label: workoutType, value: duration }),

  // Purchase tracking
  purchase: (value: number, currency = "USD", itemId?: string) =>
    trackEvent("purchase", { event_category: "ecommerce", value, currency, event_label: itemId }),
}
