"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users, Award, CheckCircle, Calendar, MessageCircle, Phone, Mail } from "lucide-react"

export interface TrainerData {
  id?: string
  tempId?: string
  name: string
  title?: string
  specialties?: string[]
  bio?: string
  experience?: string
  certifications?: string[]
  location?: string
  rating?: number
  reviewCount?: number
  hourlyRate?: number
  availability?: string[]
  profileImage?: string
  languages?: string[]
  achievements?: string[]
  workoutTypes?: string[]
  equipment?: string[]
  clientCount?: number
  yearsExperience?: number
  contactEmail?: string
  contactPhone?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    linkedin?: string
  }
  gallery?: string[]
  testimonials?: Array<{
    name: string
    rating: number
    comment: string
    date: string
  }>
  packages?: Array<{
    name: string
    description: string
    price: number
    duration: string
    sessions: number
  }>
}

interface TrainerProfileDisplayProps {
  trainer: TrainerData
  mode?: "live" | "temp"
  onContact?: () => void
  onBookSession?: () => void
  onViewPackages?: () => void
  className?: string
}

export default function TrainerProfileDisplay({
  trainer,
  mode = "live",
  onContact,
  onBookSession,
  onViewPackages,
  className = "",
}: TrainerProfileDisplayProps) {
  const {
    name = "Professional Trainer",
    title = "Certified Personal Trainer",
    specialties = [],
    bio = "Experienced fitness professional dedicated to helping clients achieve their goals.",
    experience = "New to the platform",
    certifications = [],
    location = "Location not specified",
    rating = 0,
    reviewCount = 0,
    hourlyRate = 0,
    availability = [],
    profileImage,
    languages = ["English"],
    achievements = [],
    workoutTypes = [],
    equipment = [],
    clientCount = 0,
    yearsExperience = 0,
    contactEmail,
    contactPhone,
    socialMedia = {},
    gallery = [],
    testimonials = [],
    packages = [],
  } = trainer

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Mode Indicator */}
      {mode === "temp" && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Preview Mode - This profile is not yet live</span>
          </div>
        </div>
      )}

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt={name} />
                <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">{getInitials(name)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                <p className="text-xl text-gray-600">{title}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}

                {rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="flex">{renderStars(rating)}</div>
                    <span>{rating.toFixed(1)}</span>
                    {reviewCount > 0 && <span className="text-gray-400">({reviewCount} reviews)</span>}
                  </div>
                )}

                {yearsExperience > 0 && (
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>{yearsExperience} years experience</span>
                  </div>
                )}

                {clientCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{clientCount} clients</span>
                  </div>
                )}
              </div>

              {hourlyRate > 0 && (
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(hourlyRate)}/hour</div>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              {mode === "live" && (
                <>
                  <Button onClick={onBookSession} className="bg-orange-600 hover:bg-orange-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                  <Button variant="outline" onClick={onContact}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Trainer
                  </Button>
                  {packages.length > 0 && (
                    <Button variant="outline" onClick={onViewPackages}>
                      View Packages
                    </Button>
                  )}
                </>
              )}
              {mode === "temp" && (
                <Button disabled variant="outline">
                  Profile in Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      {bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certifications */}
        {certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Workout Types */}
        {workoutTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Workout Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {workoutTypes.map((type, index) => (
                  <Badge key={index} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Equipment */}
        {equipment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Equipment Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {equipment.map((item, index) => (
                  <Badge key={index} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Availability */}
      {availability.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availability.map((slot, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                  {slot}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Training Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">{pkg.name}</h4>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-600">{formatCurrency(pkg.price)}</span>
                    <span className="text-sm text-gray-500">{pkg.sessions} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Client Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border-l-4 border-orange-200 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                    <span className="font-medium">{testimonial.name}</span>
                    <span className="text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {mode === "live" && (contactEmail || contactPhone) && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href={`mailto:${contactEmail}`} className="text-orange-600 hover:underline">
                    {contactEmail}
                  </a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${contactPhone}`} className="text-orange-600 hover:underline">
                    {contactPhone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
