"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, BadgeCheck, Award, MessageCircle, ArrowRight, User, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import type { Trainer } from "@/app/(landing-pages)/utils/trainer-directory-utils"

interface TrainerDirectoryLayoutProps {
  city: string
  districts: string[]
  trainers: Trainer[]
}

const sectionClass = "px-4 md:px-6 max-w-6xl mx-auto"
const badgeBase = "border-0 rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-white flex-shrink-0"
const iconBase = "h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1"
const btnBase = "rounded-lg text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
const btnActive = "bg-juice text-gray-900 hover:bg-juice/90 border-juice"
const btnInactive = "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
const cardVerified = "border-2 border-juice hover:border-juice/80 bg-gradient-to-br from-white to-[#f8fff0]"
const cardUnverified = "border border-juice/30 hover:border-juice/50 bg-[#fafafa]"
const profileBase = "flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden"
const badgeVerified = "bg-gradient-to-r from-green-500 to-green-600"
const badgeCert = "bg-gradient-to-r from-blue-500 to-blue-600"
const badgeReviews = "bg-gradient-to-r from-blue-400 to-blue-500"
const badgeContainerMaxHeight = "1.375rem"

function TrainerCard({ trainer }: { trainer: Trainer }) {
  const badgeRef = useRef<HTMLDivElement>(null)
  const [hiddenCount, setHiddenCount] = useState(0)
  
  const totalBadges = Number(trainer.isVerified) + trainer.certifications.length + Number(trainer.hasReviews)
  
  useEffect(() => {
    if (!badgeRef.current) return
    const container = badgeRef.current
    const checkOverflow = () => {
      if (container.scrollHeight <= container.clientHeight) {
        setHiddenCount(0)
        return
      }
      const containerBottom = container.getBoundingClientRect().bottom
      const visibleCount = Array.from(container.children).filter((child) => 
        child.getBoundingClientRect().bottom <= containerBottom + 1
      ).length
      setHiddenCount(Math.max(0, totalBadges - visibleCount))
    }
    
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    const timeout = setTimeout(checkOverflow, 100)
    return () => {
      window.removeEventListener("resize", checkOverflow)
      clearTimeout(timeout)
    }
  }, [trainer, totalBadges])

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  const truncateName = (name: string) => name.length > 20 ? `${name.slice(0, 20)}...` : name
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    const parent = target.parentElement
    if (parent) {
      target.style.display = "none"
      parent.innerHTML = `<span class="text-white font-bold text-sm sm:text-base">${getInitials(trainer.name)}</span>`
    }
  }
  const isVerified = trainer.isVerified
  const trainerUrl = trainer.publicPath ? `https://app.juice.fitness${trainer.publicPath}` : undefined

  const badgeConfig = {
    verified: { Icon: BadgeCheck, className: badgeVerified, text: "Verified" },
    cert: { Icon: Award, className: badgeCert },
    reviews: { Icon: MessageCircle, className: badgeReviews, text: "Reviews" }
  } as const
  const renderBadge = (type: "verified" | "cert" | "reviews", certIndex?: number, truncate?: boolean) => {
    if (type === "cert" && certIndex === undefined) return null
    const config = badgeConfig[type]
    const text = type === "cert" ? trainer.certifications[certIndex!] : (config as { text: string }).text
    return (
      <Badge key={type === "cert" ? `cert-${certIndex}` : type} className={`${badgeBase} ${config.className}`}>
        <config.Icon className={iconBase} />
        {type === "cert" ? <span className="truncate max-w-[120px]">{text}</span> : text}
      </Badge>
    )
  }

  const mobileBadges = [
    isVerified && { type: "verified" as const },
    trainer.certifications.length > 0 && { type: "cert" as const, certIndex: 0 },
    trainer.hasReviews && { type: "reviews" as const }
  ].filter(Boolean).slice(0, 2) as Array<{ type: "verified" | "cert" | "reviews"; certIndex?: number }>

  return (
    <a href={trainerUrl} className="block no-underline w-full" target="_blank" rel="noopener noreferrer" onClick={(e) => !trainerUrl && e.preventDefault()}>
    <Card className={`w-full rounded-lg transition-colors cursor-pointer h-[140px] md:h-auto overflow-hidden ${isVerified ? cardVerified : cardUnverified}`}>
      <CardContent className="p-4 sm:p-6 h-full flex">
        <div className="flex items-start gap-3 sm:gap-4 h-full flex-1 min-w-0">
          <div className={`${profileBase} flex-shrink-0 ${isVerified ? "bg-gradient-to-br from-blue-400 to-purple-500" : "bg-gray-200"}`}>
            {isVerified ? (
              <img
                src={trainer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.name)}&background=4f46e5&color=fff&size=128&bold=true`}
                alt={trainer.name}
                className={`w-full h-full object-cover ${trainer.imageUrl ? "rounded-full" : ""}`}
                onError={handleImageError}
              />
            ) : (
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0 flex items-center">
            <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
              <div className="flex items-start justify-between mb-1 md:mb-2 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-1 font-sen">{truncateName(trainer.name)}</h3>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <div className="md:hidden flex items-center gap-1 flex-nowrap overflow-hidden">
                      {mobileBadges.map((badge, idx) => renderBadge(badge.type, badge.certIndex, idx === 1))}
                    </div>
                    <div ref={badgeRef} className="hidden md:flex items-center gap-1 sm:gap-2 flex-wrap overflow-hidden" style={{ maxHeight: badgeContainerMaxHeight }}>
                      {isVerified && renderBadge("verified")}
                      {trainer.certifications.map((_, i) => renderBadge("cert", i))}
                      {trainer.hasReviews && renderBadge("reviews")}
                    </div>
                    {hiddenCount > 0 && (
                      <span className="hidden md:inline text-gray-500 text-xs whitespace-nowrap ml-1">
                        and {hiddenCount} More
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="md:hidden text-xs text-gray-700 mb-1 line-clamp-2">{trainer.specialties.slice(0, 3).join(" • ")}{trainer.specialties.length > 3 && " • ..."}</p>
              <p className="hidden md:block text-sm sm:text-base text-gray-700 mb-2 break-words">{trainer.specialties.join(" • ")}</p>
              <div className="flex items-center gap-1 text-gray-600 text-xs">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {[...(trainer.districtDisplay ? [trainer.districtDisplay] : trainer.locations), trainer.isOnline && "Online"].filter(Boolean).join(" • ")}
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2 md:ml-4" />
          </div>
        </div>
      </CardContent>
    </Card>
    </a>
  )
}

export function TrainerDirectoryLayout({ city, districts, trainers }: TrainerDirectoryLayoutProps) {
  const searchParams = useSearchParams()
  const districtsParam = searchParams.get("districts")
  const isInitialMount = useRef(true)
  
  const [showAllDistricts, setShowAllDistricts] = useState(() => {
    // Default to "All Districts" selected if no districts param or if param is "all"
    return !districtsParam || districtsParam === "all"
  })
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(() => 
    districtsParam && districtsParam !== "all" ? districtsParam.split(",").filter(Boolean) : []
  )
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "")
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false)

  // Update URL when filters change (skip initial mount to avoid history entries)
  useEffect(() => {
    if (typeof window === "undefined" || isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (!showAllDistricts && selectedDistricts.length > 0) {
      params.set("districts", selectedDistricts.join(","))
    }
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
    const currentUrl = window.location.pathname + window.location.search
    
    // Only update if URL actually changed
    if (newUrl !== currentUrl) {
      window.history.replaceState({}, "", newUrl)
    }
  }, [selectedDistricts, searchQuery, showAllDistricts])

  const getDistrictLabel = (district: string) => district === "all" ? "All Districts" : district
  const matchesDistrict = (loc: string, selected: string) => {
    const l = loc.toLowerCase()
    const sel = selected.toLowerCase()
    return l === sel || l.includes(`-${sel}`) || l.includes(`${sel}-`) || l.includes(` ${sel} `) || l.startsWith(`${sel} `) || l.endsWith(` ${sel}`)
  }

  const handleDistrictClick = (district: string) => {
    if (district === "all") {
      setShowAllDistricts(true)
      setSelectedDistricts([])
      return
    }
    setShowAllDistricts(false)
    setSelectedDistricts((prev) => {
      const newSelection = prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]
      if (newSelection.length === 0) setShowAllDistricts(true)
      return newSelection
    })
  }

  const renderDistrictButton = (district: string, isMobile: boolean) => {
    const isSelected = !showAllDistricts && selectedDistricts.includes(district)
    const isAll = district === "all"
    const isActive = isSelected || (isAll && showAllDistricts)
    return (
      <Button
        key={district}
        variant={isMobile ? "ghost" : "outline"}
        onClick={() => {
          handleDistrictClick(district)
          if (isMobile && isAll) setIsMobileDropdownOpen(false)
        }}
        className={isMobile ? `w-full justify-start ${isActive ? "bg-juice/10" : ""}` : `${btnBase} ${isActive ? btnActive : btnInactive}`}
      >
        {getDistrictLabel(district)}
      </Button>
    )
  }

  const filteredTrainers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return trainers.filter((trainer) => {
      const districtMatch = showAllDistricts || 
        selectedDistricts.some((selected) => trainer.locations.some((loc) => matchesDistrict(loc, selected))) ||
        (trainer.isOnline && selectedDistricts.includes("Online"))
      if (!districtMatch || !query) return districtMatch
      const matches = (s: string) => s.toLowerCase().includes(query)
      return matches(trainer.name) || trainer.specialties.some(matches) || trainer.certifications.some(matches) || trainer.locations.some(matches) || (trainer.isOnline && matches("online"))
    })
  }, [trainers, selectedDistricts, searchQuery, showAllDistricts])

  return (
    <>
      <section className={`${sectionClass} py-12 md:py-16`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 text-center font-sen">
          Personal Trainer Directory {city}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto text-center">
          Find certified personal trainers in {city}. Connect with verified professionals or discover talented trainers in your neighborhood.
        </p>
      </section>

      <section className={`${sectionClass} pb-8 md:pb-12`}>
        <div className="max-w-3xl mx-auto w-full">
          <div className="relative mb-4 sm:mb-6 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search trainers by name, specialty, district, or certification..."
              className="w-full max-w-full pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base rounded-lg border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:hidden w-full">
            <Popover open={isMobileDropdownOpen} onOpenChange={setIsMobileDropdownOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`${btnBase} w-full justify-between ${showAllDistricts ? btnActive : btnInactive}`}>
                  <span>{showAllDistricts ? "All Districts" : selectedDistricts.length > 0 ? `${selectedDistricts.length} district${selectedDistricts.length > 1 ? 's' : ''} selected` : "Select Districts"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-2 max-h-[60vh] overflow-y-auto" align="start">
                <div className="space-y-1">
                  {renderDistrictButton("all", true)}
                  {districts.map((district) => renderDistrictButton(district, true))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="hidden md:flex flex-wrap gap-2 w-full">
            {renderDistrictButton("all", false)}
            {districts.map((district) => renderDistrictButton(district, false))}
          </div>
        </div>
      </section>

      <section className={`${sectionClass} pb-16 md:pb-20 w-full`}>
        <div className="w-full space-y-3 sm:space-y-4">
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer, index) => (
              <TrainerCard key={trainer.id || `trainer-${index}`} trainer={trainer} />
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

