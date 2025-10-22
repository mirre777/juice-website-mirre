/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
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

/**
 * Check if a trainer is within the specified radius of a user's location
 * @param trainerCoords Trainer's coordinates
 * @param userCoords User's coordinates
 * @param radiusKm Radius in kilometers
 * @returns True if trainer is within radius
 */
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

/**
 * Get trainers within a certain radius of user location
 * @param trainers Array of trainers
 * @param userLocation User's location
 * @param maxRadiusKm Maximum radius in kilometers
 * @returns Filtered array of nearby trainers
 */
export const getNearbyTrainers = (
  trainers: Array<{
    location: { coordinates: { lat: number; lng: number } }
    serviceRadius?: number
    remoteAvailable?: boolean
  }>,
  userLocation: { lat: number; lng: number },
  maxRadiusKm: number = 50
): Array<{
  location: { coordinates: { lat: number; lng: number } }
  serviceRadius?: number
  remoteAvailable?: boolean
}> => {
  return trainers.filter(trainer => {
    // Always show remote trainers
    if (trainer.remoteAvailable) return true
    
    // Check if trainer is within their service radius
    const trainerRadius = trainer.serviceRadius || 50
    const isWithinTrainerRadius = isWithinRadius(
      trainer.location.coordinates,
      userLocation,
      trainerRadius
    )
    
    // Also check if within user's max radius preference
    const isWithinUserRadius = isWithinRadius(
      trainer.location.coordinates,
      userLocation,
      maxRadiusKm
    )
    
    return isWithinTrainerRadius && isWithinUserRadius
  })
}
