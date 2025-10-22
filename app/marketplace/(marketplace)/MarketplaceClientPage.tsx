"use client"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Star, MapPin, Loader2 } from "lucide-react"
import { useState } from "react"
import { allTrainers, featuredTrainers, specialties } from "../(marketplace-trainers)"
import { ComingSoonModal } from "../(marketplace-trainers)/coming-soon-modal"
import { LocationDetector } from "../(marketplace-trainers)/location-detector"
import { useUserLocation } from "../(marketplace-trainers)/useUserLocation"
import { getNearbyTrainers, calculateDistance, isWithinRadius } from "@/utils/location"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"


export default function MarketplaceClientPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [showModal, setShowModal] = useState(false)
  const [selectedTrainerName, setSelectedTrainerName] = useState<string>("")
  
  // Location state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string, country: string} | null>(null)
  const [radius, setRadius] = useState(50) // km
  const [showRemote, setShowRemote] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const matchesFilters = (trainer: { name: string; location: { city: string; country: string }; specialties: string[] }) => {
    const matchesSearch = !normalizedQuery
      ? true
      : [trainer.name, trainer.location.city, trainer.location.country, ...(trainer.specialties || [])]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(normalizedQuery))

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      (trainer.specialties || []).some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase())

    return matchesSearch && matchesSpecialty
  }

  // Distance-based filtering and sorting
  const getFilteredTrainers = (trainers: typeof allTrainers) => {
    let filtered = trainers.filter(matchesFilters)
    
    // Apply location-based filtering if user location is available
    if (userLocation) {
      // Filter by distance manually since getNearbyTrainers has type issues
      filtered = filtered.filter(trainer => {
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
          radius
        )
        
        return isWithinTrainerRadius && isWithinUserRadius
      })
      
      // Filter out remote trainers if showRemote is false
      if (!showRemote) {
        filtered = filtered.filter(trainer => !trainer.remoteAvailable)
      }
      
      // Sort by distance (closest first), then by rating
      filtered.sort((a, b) => {
        const distanceA = getDistanceToTrainer(a)
        const distanceB = getDistanceToTrainer(b)
        
        // Remote trainers go to the end
        if (a.remoteAvailable && !b.remoteAvailable) return 1
        if (!a.remoteAvailable && b.remoteAvailable) return -1
        
        // If both are remote or both are local, sort by distance
        if (distanceA !== null && distanceB !== null) {
          return distanceA - distanceB
        }
        
        // Fallback to rating
        return b.rating - a.rating
      })
    } else if (!showRemote) {
      // If no location but remote is disabled, show only non-remote trainers
      filtered = filtered.filter(trainer => !trainer.remoteAvailable)
    }
    
    return filtered
  }

  const filteredFeatured = getFilteredTrainers(featuredTrainers)
  const filteredAll = getFilteredTrainers(allTrainers)

  const handleTrainerClick = (trainer: { name: string; slug: string; id: string }) => {
    setSelectedTrainerName(trainer.name)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTrainerName("")
  }

  const handleLocationDetected = (location: { lat: number; lng: number; city: string; country: string }) => {
    setUserLocation(location)
    setLocationError(null)
  }

  const handleLocationError = (error: string) => {
    setLocationError(error)
  }

  const getDistanceToTrainer = (trainer: { location: { coordinates: { lat: number; lng: number } } }) => {
    if (!userLocation) return null
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      trainer.location.coordinates.lat,
      trainer.location.coordinates.lng
    )
  }

  // Temporary debug logs
  console.log('allTrainers:', allTrainers.map((t) => t?.name))
  console.log('featuredTrainers:', featuredTrainers.map((t) => t?.name))

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20 pb-16 px-4">
          <section className="w-full max-w-7xl mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Personal Trainer <span className="bg-[#CDFF00] text-black px-3 py-1 inline-block">Marketplace</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with{" "}
                <span className="bg-[#CDFF00]/20 text-foreground px-1">certified fitness professionals</span>. Find the{" "}
                <span className="bg-[#CDFF00]/20 text-foreground px-1">perfect trainer</span> for your goals and budget.
              </p>

              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search trainers by name, specialty, or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button size="lg" className="bg-black text-white hover:bg-black/90">
                  Search Trainers
                </Button>
              </div>

              {/* Location Controls */}
              <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <LocationDetector 
                  onLocationDetected={handleLocationDetected}
                  onError={handleLocationError}
                />
                
                {userLocation && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="radius">Within:</Label>
                      <Select value={radius.toString()} onValueChange={(value) => setRadius(parseInt(value))}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5km</SelectItem>
                          <SelectItem value="10">10km</SelectItem>
                          <SelectItem value="25">25km</SelectItem>
                          <SelectItem value="50">50km</SelectItem>
                          <SelectItem value="100">100km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-remote"
                        checked={showRemote}
                        onCheckedChange={setShowRemote}
                      />
                      <Label htmlFor="show-remote">Show remote trainers</Label>
                    </div>
                    
                    <div className="text-sm text-green-600">
                      📍 Location: {userLocation.city}
                    </div>
                  </>
                )}
                
                {locationError && (
                  <div className="text-sm text-red-600">
                    {locationError}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={
                      selectedSpecialty === specialty
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "hover:bg-muted/50"
                    }
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Featured Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTrainerClick(trainer)}
                  role="button"
                  aria-label={`Open ${trainer.name} microsite`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-[#CDFF00] text-black hover:bg-[#CDFF00]/90 border-0">
                      {trainer.certification}
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
                    {trainer.location && (
                      <p className="text-xs text-muted-foreground mb-1">{trainer.location.city}, {trainer.location.country}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{trainer.specialties.join(" • ")}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{trainer.rating}</span>
                        <span className="text-sm text-muted-foreground">({trainer.reviews})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">€{trainer.hourlyRate}/hr</span>
                        {userLocation && (
                          <p className="text-xs text-muted-foreground">
                            {trainer.remoteAvailable ? "🌐 Remote" : `${getDistanceToTrainer(trainer)?.toFixed(1)}km away`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">All Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAll.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleTrainerClick(trainer)}
                  role="button"
                  aria-label={`Open ${trainer.name} microsite`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="font-bold mb-0.5">{trainer.name}</h3>
                    {trainer.location && (
                      <p className="text-[11px] text-muted-foreground mb-1">{trainer.location.city}, {trainer.location.country}</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{trainer.specialties.join(" • ")}</p>
                    <div className="flex items-center justify-between text-sm mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{trainer.rating}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">€{trainer.hourlyRate}/hr</span>
                        {userLocation && (
                          <p className="text-[10px] text-muted-foreground">
                            {trainer.remoteAvailable ? "🌐 Remote" : `${getDistanceToTrainer(trainer)?.toFixed(1)}km away`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <ComingSoonModal
        isOpen={showModal}
        onClose={closeModal}
        trainerName={selectedTrainerName}
      />
    </ThemeProvider>
  )
}
