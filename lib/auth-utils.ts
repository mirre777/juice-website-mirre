// Simple token-based authentication for trainer ownership
export function generateOwnerToken(trainerId: string): string {
  // In production, this should be a proper JWT or session token
  // For now, we'll use a simple encoded string
  return btoa(`owner:${trainerId}:${Date.now()}`)
}

export function validateOwnerToken(token: string, trainerId: string): boolean {
  try {
    const decoded = atob(token)
    const [prefix, id] = decoded.split(":")
    return prefix === "owner" && id === trainerId
  } catch {
    return false
  }
}

export function getOwnerTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null

  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("token")
}

export function isOwnerAuthenticated(trainerId: string): boolean {
  const token = getOwnerTokenFromUrl()
  if (!token) return false
  return validateOwnerToken(token, trainerId)
}
