import { MapPin, Loader2 } from "lucide-react"
import { useUserLocation } from "./useUserLocation"

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
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
    </button>
  )
}
