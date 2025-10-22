"use client"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, MapPin, Loader2 } from "lucide-react"
import { useState } from "react"
import { allTrainers, featuredTrainers, specialties } from "../(marketplace-trainers)"
import { ComingSoonModal } from "../(marketplace-trainers)/coming-soon-modal"
import { LocationDetector } from "../(marketplace-trainers)/location-detector"
import { useUserLocation } from "../(marketplace-trainers)/useUserLocation"
import { getNearbyTrainers, calculateDistance, isWithinRadius } from "@/utils/location"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ClientWaitlistForm } from "@/components/client-waitlist-form"

export default function MarketplaceClientPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [showModal, setShowModal] = useState(false)
  const [selectedTrainerName, setSelectedTrainerName] = useState<string>("")
  
  // Location state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string, country: string} | null>(null)
  const [radius, setRadius] = useState(50) // km
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showLocationSections, setShowLocationSections] = useState(false)

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const getDistanceToTrainer = (trainer: { location: { coordinates: { lat: number; lng: number } } }) => {
    if (!userLocation) return null
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      trainer.location.coordinates.lat,
      trainer.location.coordinates.lng
    )
  }

  const matchesFilters = (trainer: { name: string; location: { city: string; country: string }; specialties: string[] }) => {
    const matchesSearch =
      normalizedQuery === "" ||
      [
        trainer.name,
        trainer.location.city,
        trainer.location.country,
        ...(trainer.specialties || [])
      ]
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
        
        // Check if trainer has coordinates
        if (!trainer.location.coordinates) return true
        
        // Check if trainer is within radius
        return isWithinRadius(
          trainer.location.coordinates,
          { lat: userLocation.lat, lng: userLocation.lng },
          radius
        )
      })
      
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
    }
    
    return filtered
  }

  const filteredFeatured = getFilteredTrainers(featuredTrainers)
  const filteredAll = getFilteredTrainers(allTrainers)

  const handleTrainerClick = (trainer: any) => {
    setSelectedTrainerName(trainer.name || trainer)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTrainerName("")
  }

  const handleLocationDetected = (location: { lat: number; lng: number; city: string; country: string }) => {
    if (userLocation && showLocationSections) {
      // If location is already detected and sections are shown, collapse them
      setShowLocationSections(false)
      setUserLocation(null)
    } else {
      // Otherwise, detect location and show sections
      setUserLocation(location)
      setLocationError(null)
      setShowLocationSections(true)
    }
  }

  const handleLocationError = (error: string) => {
    setLocationError(error)
  }

  // Temporary debug logs
  console.log('allTrainers:', allTrainers.map((t) => t?.name))
  console.log('featuredTrainers:', featuredTrainers.map((t) => t?.name))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16 px-4">
        <section className="w-full max-w-7xl mx-auto py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Personal Trainer <span className="bg-[#CDFF00] text-black px-3 py-1 inline-block">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with{" "}
              <span className="bg-[#CDFF00]/20 text-foreground px-1">certified fitness professionals</span>. Find the{" "}
              <span className="bg-[#CDFF00]/20 text-foreground px-1">perfect trainer</span> for your goals and budget.
            </p>

             <div className="flex gap-2 mb-6">
               <div className="relative flex-1">
                 <Input
                   type="text"
                   placeholder="Search trainers by name, specialty, or location"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-4 pr-12"
                 />
                 <LocationDetector 
                   onLocationDetected={handleLocationDetected}
                   onError={handleLocationError}
                   className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 hover:text-pink-600 cursor-pointer"
                 />
               </div>
              <Button size="lg" className="bg-black text-white hover:bg-black/90">
                Search Trainers
              </Button>
            </div>

                
            {locationError && (
              <div className="text-sm text-red-600">
                {locationError}
              </div>
            )}

             {/* Specialty Filter */}
             <div className="flex flex-wrap gap-2 mb-8">
               {specialties.map((specialty) => (
                 <Button
                   key={specialty}
                   variant={selectedSpecialty === specialty ? "default" : "outline"}
                   size="sm"
                   onClick={() => setSelectedSpecialty(specialty)}
                 >
                   {specialty}
                 </Button>
               ))}
             </div>

             {/* Location Controls */}
             {userLocation && (
               <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
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
                       <SelectItem value="75">75km</SelectItem>
                       <SelectItem value="100">100km</SelectItem>
                       <SelectItem value="150">150km</SelectItem>
                       <SelectItem value="200">200km</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
             )}
           </div>
         </section>

        {/* Location-based sections */}
        {showLocationSections && userLocation ? (
          <>
             {/* Trainers Near You */}
             <section className="w-full max-w-7xl mx-auto py-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-8">Trainers Near You within {radius}km</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeatured
                  .filter(trainer => !trainer.remoteAvailable)
                  .map((trainer) => (
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
                          <p className="text-xs text-muted-foreground">
                            {getDistanceToTrainer(trainer)?.toFixed(1)}km away
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Client Waitlist Widget */}
            <section className="w-full max-w-7xl mx-auto py-12">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Can't find the perfect trainer?
                </h3>
                <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
                  Join our waitlist and we'll notify you when new trainers join in your area. 
                  Get early access to the best fitness professionals near you!
                </p>
                <div className="max-w-md mx-auto">
                  <ClientWaitlistForm selectedPlan="basic" source="marketplace" />
                </div>
              </div>
            </section>

          </>
        ) : (
          /* Default Featured Trainers */
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
        )}

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
      </main>

      <Footer />
      
      <ComingSoonModal
        isOpen={showModal}
        onClose={closeModal}
        trainerName={selectedTrainerName}
      />
    </div>
  )
}
