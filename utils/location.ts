// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Check if trainer is within radius of user location
export const isWithinRadius = (
  trainerCoords: { lat: number; lng: number },
  userCoords: { lat: number; lng: number },
  radiusKm: number
): boolean => {
  const distance = calculateDistance(
    trainerCoords.lat,
    trainerCoords.lng,
    userCoords.lat,
    userCoords.lng
  )
  return distance <= radiusKm
}

