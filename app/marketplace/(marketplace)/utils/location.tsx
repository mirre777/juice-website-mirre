import { useState } from 'react'
import { MapPin, Loader2 } from "lucide-react"

// Types
export interface UserLocation {
  lat: number
  lng: number
  city: string
  country: string
  accuracy?: number
  source: 'gps' | 'ip' | 'manual'
}

// Hook for user location detection
export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          })
        })

        const location: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: 'Your Location',
          country: 'Detected',
          accuracy: position.coords.accuracy,
          source: 'gps'
        }

        setUserLocation(location)
        return location
      } else {
        throw new Error('Geolocation not supported')
      }
    } catch (err) {
      setError('Unable to detect your location')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    userLocation,
    isLoading,
    error,
    requestLocation
  }
}

// LocationDetector component
interface LocationDetectorProps {
  onLocationDetected: (location: { lat: number; lng: number; city: string; country: string }) => void
  onError: (error: string) => void
  className?: string
}

export function LocationDetector({ onLocationDetected, onError, className }: LocationDetectorProps) {
  const { userLocation, isLoading, error, requestLocation } = useUserLocation()

  const handleLocationRequest = async () => {
    const location = await requestLocation()
    if (location) {
      onLocationDetected(location)
    } else if (error) {
      onError(error)
    }
  }

  return (
    <button
      onClick={handleLocationRequest}
      disabled={isLoading}
      className={className}
      title="Use My Location"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
      ) : (
        <MapPin className="h-4 w-4 text-pink-500" />
      )}
    </button>
  )
}

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
