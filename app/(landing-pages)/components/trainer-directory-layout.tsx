"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Check, User, MessageCircle, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Trainer {
  id: string
  name: string
  imageUrl?: string
  isVerified: boolean
  certifications: string[]
  hasReviews: boolean
  specialties: string[]
  locations: string[]
  isOnline: boolean
}

interface TrainerDirectoryLayoutProps {
  city: string
  districts: string[]
  trainers: Trainer[]
}

const sectionClass = "px-4 sm:px-6 max-w-6xl mx-auto"
const badgeClass = "border-0 rounded-md px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-white"
const iconClass = "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1"
const buttonClass = "rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
const buttonActiveClass = "bg-juice text-gray-900 hover:bg-juice/90 border-juice"
const buttonInactiveClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"

export function TrainerDirectoryLayout({ city, districts, trainers }: TrainerDirectoryLayoutProps) {
  const searchParams = useSearchParams()
  const districtsParam = searchParams.get("districts")
  
  const [showAllDistricts, setShowAllDistricts] = useState(() => !districtsParam || districtsParam === "all")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(() => 
    districtsParam && districtsParam !== "all" ? districtsParam.split(",").filter(Boolean) : []
  )
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "")

  // Update URL when filters change (client-side only to avoid hydration issues)
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (!showAllDistricts && selectedDistricts.length > 0) {
      params.set("districts", selectedDistricts.join(","))
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.pushState({}, "", newUrl)
  }, [selectedDistricts, searchQuery, showAllDistricts])

  const handleDistrictClick = (district: string) => {
    if (district === "all") {
      setShowAllDistricts(true)
      setSelectedDistricts([])
    } else {
      setShowAllDistricts(false)
      setSelectedDistricts((prev) => {
        const newSelection = prev.includes(district) 
          ? prev.filter((d) => d !== district)
          : [...prev, district]
        // If no districts selected, automatically select "all"
        if (newSelection.length === 0) {
          setShowAllDistricts(true)
          return []
        }
        return newSelection
      })
    }
  }

  // Filter trainers based on selected districts and search query
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      // Filter by districts
      const matchesDistrict = showAllDistricts || 
        trainer.locations.some((loc) => selectedDistricts.includes(loc)) ||
        (trainer.isOnline && selectedDistricts.includes("Online"))

      if (!matchesDistrict) return false

      // Filter by search query
      if (!searchQuery.trim()) return true

      const query = searchQuery.toLowerCase()
      return (
        trainer.name.toLowerCase().includes(query) ||
        trainer.specialties.some((s) => s.toLowerCase().includes(query)) ||
        trainer.certifications.some((c) => c.toLowerCase().includes(query))
      )
    })
  }, [trainers, selectedDistricts, searchQuery, showAllDistricts])

  return (
    <>
      <section className={`${sectionClass} py-8 sm:py-12`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Personal Trainer Directory {city}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-3xl">
          Find certified personal trainers in {city}. Connect with verified professionals or discover talented trainers in your neighborhood.
        </p>
      </section>

      <section className={`${sectionClass} pb-6 sm:pb-8`}>
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trainers by name or specialty..."
            className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleDistrictClick("all")}
            className={`${buttonClass} ${showAllDistricts ? buttonActiveClass : buttonInactiveClass}`}
          >
            All Districts
          </Button>
          {districts.map((district) => {
            const isSelected = !showAllDistricts && selectedDistricts.includes(district)
            return (
              <Button
                key={district}
                variant="outline"
                onClick={() => handleDistrictClick(district)}
                className={`${buttonClass} ${isSelected ? buttonActiveClass : buttonInactiveClass}`}
              >
                {district}
              </Button>
            )
          })}
        </div>
      </section>

      <section className={`${sectionClass} pb-12 sm:pb-16`}>
        <div className="space-y-3 sm:space-y-4">
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer) => (
              <Card key={trainer.id} className="rounded-lg border-juice/30 hover:border-juice/50 transition-colors cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{trainer.name}</h3>
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            {trainer.isVerified && (
                              <Badge className={`${badgeClass} bg-green-500`}>
                                <Check className={iconClass} />
                                Verified
                              </Badge>
                            )}
                            {trainer.certifications.map((cert, i) => (
                              <Badge key={i} className={`${badgeClass} bg-blue-500`}>
                                <User className={iconClass} />
                                {cert}
                              </Badge>
                            ))}
                            {trainer.hasReviews && (
                              <Badge className={`${badgeClass} bg-blue-400`}>
                                <MessageCircle className={iconClass} />
                                Reviews
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 mb-2 break-words">{trainer.specialties.join(" • ")}</p>
                      <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="break-words">
                          {trainer.locations.join(" • ")}
                          {trainer.isOnline && " • Online"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No trainers found matching your filters.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

