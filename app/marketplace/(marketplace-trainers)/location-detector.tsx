import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { useUserLocation } from "./useUserLocation"

interface LocationDetectorProps {
  onLocationDetected: (location: { lat: number; lng: number; city: string; country: string }) => void
  onError: (error: string) => void
}

export function LocationDetector({ onLocationDetected, onError }: LocationDetectorProps) {
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
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleLocationRequest}
        disabled={isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {isLoading ? "Detecting..." : "📍 Use My Location"}
      </Button>
      
      {userLocation && (
        <p className="text-sm text-green-600">
          Location detected: {userLocation.city}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
