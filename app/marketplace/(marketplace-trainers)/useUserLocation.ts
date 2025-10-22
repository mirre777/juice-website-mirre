import { useState } from 'react'

export interface UserLocation {
  lat: number
  lng: number
  city: string
  country: string
  accuracy?: number // GPS accuracy in meters
  source: 'gps' | 'ip' | 'manual'
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Try browser geolocation API first
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

  const clearLocation = () => {
    setUserLocation(null)
    setError(null)
  }

  return {
    userLocation,
    isLoading,
    error,
    requestLocation,
    clearLocation
  }
}
