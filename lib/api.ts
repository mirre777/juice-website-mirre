// Central place to define API URLs and fetch helpers

// Updated with the correct API URL
export const API_URL = "https://juice-api.vercel.app"

// Helper function for API calls
export async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// Subscription-related API calls
export const subscriptionAPI = {
  // Check if a user has an active subscription
  checkSubscription: (userId: string) =>
    fetchFromAPI<{ active: boolean; subscription?: any }>(`/api/subscriptions?userId=${userId}`),

  // Create or update a subscription
  createSubscription: (userId: string, paymentIntentId: string) =>
    fetchFromAPI<{ success: boolean; subscription: any }>("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify({ userId, paymentIntentId }),
    }),
}

// Payment-related API calls
export const paymentAPI = {
  // Get payment history for a user
  getPaymentHistory: (userId: string) => fetchFromAPI<{ payments: any[] }>(`/api/payments?userId=${userId}`),

  // Record a payment
  recordPayment: (userId: string, paymentIntentId: string, amount?: number, description?: string) =>
    fetchFromAPI<{ success: boolean; payment: any }>("/api/payments", {
      method: "POST",
      body: JSON.stringify({ userId, paymentIntentId, amount, description }),
    }),

  // Create a payment intent
  createPaymentIntent: (amount: string, description: string, metadata?: Record<string, any>) =>
    fetchFromAPI<{ clientSecret: string; paymentIntentId: string }>("/api/payments/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ amount, description, metadata }),
    }),

  // Verify a payment
  verifyPayment: (paymentIntentId: string) =>
    fetchFromAPI<{ success: boolean; paymentIntent?: any }>("/api/payments/verify-payment", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
    }),
}

// Access verification API calls
export const accessAPI = {
  // Verify if a user has access to premium content
  verifyAccess: (userId: string, contentId?: string) =>
    fetchFromAPI<{ hasAccess: boolean; subscription?: any }>("/api/auth/verify-access", {
      method: "POST",
      body: JSON.stringify({ userId, contentId }),
    }),
}
