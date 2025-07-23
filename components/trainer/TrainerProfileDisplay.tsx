"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Clock, Star, User, Award, Dumbbell } from "lucide-react"

export interface TrainerData {
  id?: string
  name: string
  specialty?: string
  experience?: string
  location?: string
  email?: string
  phone?: string
  bio?: string
  certifications?: string[]
  services?: string[]
  availability?: {
    [key: string]: string
  }
  rating?: number
  reviewCount?: number
  profileImage?: string
  isActive?: boolean
}

export interface TrainerProfileDisplayProps {
  trainer: TrainerData
  mode: "live" | "temp"
  onBookConsultation?: () => void
  onScheduleConsultation?: () => void
  onActivateWebsite?: () => void
  onEditProfile?: () => void
  showEditControls?: boolean
}

export function TrainerProfileDisplay({
  trainer,
  mode,
  onBookConsultation,
  onScheduleConsultation,
  onActivateWebsite,
  onEditProfile,
  showEditControls = false,
}: TrainerProfileDisplayProps) {
  const {
    name = "Trainer Name",
    specialty = "Fitness Specialist",
    experience = "1-2 years",
    location = "Location",
    email = "",
    phone = "",
    bio = "Passionate fitness professional dedicated to helping clients achieve their health and fitness goals.",
    certifications = [],
    services = [],
    availability = {},
    rating = 5.0,
    reviewCount = 0,
    profileImage,
    isActive = false,
  } = trainer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner for Temp Mode */}
      {mode === "temp" && (
        <div className="bg-[#D2FF28] text-black py-3 px-4 text-center font-medium">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Preview Expires In</span>
            </div>
            <Button onClick={onActivateWebsite} className="bg-black text-white hover:bg-gray-800 text-sm px-4 py-1">
              Activate Now - €70
            </Button>
          </div>
        </div>
      )}

      {/* Status Bar for Live Mode */}
      {mode === "live" && showEditControls && (
        <div className="bg-white border-b py-3 px-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live
              </Badge>
              <span className="text-sm text-gray-600">Active Profile</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEditProfile}>
                Edit Profile
              </Button>
              <Button>Dashboard</Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">Transform Your Fitness with {name}</h1>
            <p className="text-xl mb-6">
              Professional {specialty} trainer with {experience} of experience
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <User className="w-4 h-4 mr-1" />
                {experience} Experience
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <MapPin className="w-4 h-4 mr-1" />
                {location}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Award className="w-4 h-4 mr-1" />
                {specialty}
              </Badge>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={mode === "temp" ? onBookConsultation : onScheduleConsultation}
            >
              {mode === "temp" ? "Book Free Consultation" : "Schedule Consultation"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  About {name}
                </h2>
                <p className="text-gray-600 leading-relaxed">{bio}</p>

                {certifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Dumbbell className="w-6 h-6" />
                  Services Offered
                </h2>
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Services will be displayed here once added.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Let's Start Your Fitness Journey</h3>
                <div className="space-y-3">
                  {email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{phone}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                  onClick={mode === "temp" ? onBookConsultation : onScheduleConsultation}
                >
                  {mode === "temp" ? "Schedule Consultation" : "Book Session"}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty</span>
                    <span className="font-medium">{specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{services.length}</span>
                  </div>
                  {reviewCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {rating} ({reviewCount})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            {Object.keys(availability).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Availability</h3>
                  <div className="space-y-2">
                    {Object.entries(availability).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600">{day}</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Activation CTA for Temp Mode */}
        {mode === "temp" && (
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Make Your Website Live?</h2>
              <p className="text-gray-600 mb-6">One-time activation fee • No monthly costs • Full ownership</p>
              <Button size="lg" className="bg-[#D2FF28] text-black hover:bg-[#c5f01f]" onClick={onActivateWebsite}>
                Activate Website - €70
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
