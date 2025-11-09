"use client"

import { Search, MapPin, Check, User, MessageCircle, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

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

export function TrainerDirectoryLayout({ city, districts, trainers }: TrainerDirectoryLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Personal Trainer Directory {city}
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Find certified personal trainers in {city}. Connect with verified professionals or discover talented trainers in your neighborhood.
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 pb-8 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trainers by name or specialty..."
            className="pl-10 h-12 text-base rounded-lg border-gray-300"
          />
        </div>

        {/* District Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full bg-juice text-gray-900 hover:bg-juice/90 border-juice"
          >
            All Districts
          </Button>
          {districts.map((district) => (
            <Button
              key={district}
              variant="outline"
              className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            >
              {district}
            </Button>
          ))}
        </div>
      </section>

      {/* Trainer Listings Section */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <div className="space-y-4">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="rounded-lg border-juice/30 hover:border-juice/50 transition-colors cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {trainer.imageUrl ? (
                      <Image
                        src={trainer.imageUrl}
                        alt={trainer.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Trainer Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name and Badges */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {trainer.isVerified && (
                            <Badge className="bg-green-500 text-white border-0 rounded-md px-2 py-0.5 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {trainer.certifications.map((cert, index) => (
                            <Badge
                              key={index}
                              className="bg-blue-500 text-white border-0 rounded-md px-2 py-0.5 text-xs"
                            >
                              <User className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                          {trainer.hasReviews && (
                            <Badge className="bg-blue-400 text-white border-0 rounded-md px-2 py-0.5 text-xs">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Reviews
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>

                    {/* Specialties */}
                    <p className="text-gray-700 mb-2">
                      {trainer.specialties.join(" • ")}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {trainer.locations.join(" • ")}
                        {trainer.isOnline && " • Online"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

