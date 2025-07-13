"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Clock,
  Award,
  Dumbbell,
  Heart,
  Target,
  Edit3,
  Save,
  Eye,
  Plus,
  X,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Service {
  id: string
  name: string
  description: string
  price: string
  duration: string
}

interface TrainerData {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  experience: string
  specializations: string[]
  services: Service[]
  testimonials: Array<{
    id: string
    name: string
    text: string
    rating: number
  }>
}

export default function TempTrainerPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [trainerData, setTrainerData] = useState<TrainerData>({
    name: "Alex Johnson",
    title: "Certified Personal Trainer & Nutrition Coach",
    bio: "Passionate fitness professional with over 8 years of experience helping clients achieve their health and fitness goals. Specialized in strength training, weight loss, and sports performance.",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA",
    experience: "8+ years",
    specializations: ["Strength Training", "Weight Loss", "Sports Performance", "Nutrition Coaching"],
    services: [
      {
        id: "1",
        name: "Personal Training Session",
        description: "One-on-one training session tailored to your goals",
        price: "$80",
        duration: "60 min",
      },
      {
        id: "2",
        name: "Nutrition Consultation",
        description: "Comprehensive nutrition assessment and meal planning",
        price: "$120",
        duration: "90 min",
      },
      {
        id: "3",
        name: "Group Training",
        description: "Small group training sessions (2-4 people)",
        price: "$45",
        duration: "45 min",
      },
    ],
    testimonials: [
      {
        id: "1",
        name: "Sarah M.",
        text: "Alex helped me lose 30 pounds and gain confidence. Best trainer I've ever worked with!",
        rating: 5,
      },
      {
        id: "2",
        name: "Mike R.",
        text: "Professional, knowledgeable, and motivating. Highly recommend!",
        rating: 5,
      },
    ],
  })

  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    price: "",
    duration: "",
  })

  const [showAddService, setShowAddService] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast({
        title: "Changes saved!",
        description: "Your trainer profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addService = () => {
    if (newService.name && newService.description && newService.price && newService.duration) {
      const service: Service = {
        ...newService,
        id: Date.now().toString(),
      }
      setTrainerData((prev) => ({
        ...prev,
        services: [...prev.services, service],
      }))
      setNewService({ name: "", description: "", price: "", duration: "" })
      setShowAddService(false)
    }
  }

  const removeService = (serviceId: string) => {
    setTrainerData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== serviceId),
    }))
  }

  const addSpecialization = (spec: string) => {
    if (spec && !trainerData.specializations.includes(spec)) {
      setTrainerData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, spec],
      }))
    }
  }

  const removeSpecialization = (spec: string) => {
    setTrainerData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trainer Profile</h1>
              <p className="text-gray-600">Customize your professional profile</p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt={trainerData.name} />
                    <AvatarFallback className="text-2xl">
                      {trainerData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={trainerData.name}
                            onChange={(e) => setTrainerData((prev) => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={trainerData.title}
                            onChange={(e) => setTrainerData((prev) => ({ ...prev, title: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-3xl">{trainerData.name}</CardTitle>
                        <CardDescription className="text-lg mt-2">{trainerData.title}</CardDescription>
                        <div className="flex items-center gap-4 mt-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {trainerData.experience}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">5.0 (24 reviews)</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={trainerData.bio}
                      onChange={(e) => setTrainerData((prev) => ({ ...prev, bio: e.target.value }))}
                      className="mt-1 min-h-[120px] resize-y"
                      placeholder="Tell clients about your experience and approach..."
                    />
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{trainerData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trainerData.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {spec}
                      {isEditing && (
                        <button onClick={() => removeSpecialization(spec)} className="ml-1 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const spec = prompt("Enter specialization:")
                        if (spec) addSpecialization(spec)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Services & Pricing
                  </CardTitle>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setShowAddService(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Service
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddService && (
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input
                            id="serviceName"
                            value={newService.name}
                            onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Personal Training"
                          />
                        </div>
                        <div>
                          <Label htmlFor="servicePrice">Price</Label>
                          <Input
                            id="servicePrice"
                            value={newService.price}
                            onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="e.g., $80"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDuration">Duration</Label>
                          <Input
                            id="serviceDuration"
                            value={newService.duration}
                            onChange={(e) => setNewService((prev) => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g., 60 min"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Input
                            id="serviceDescription"
                            value={newService.description}
                            onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={addService} size="sm">
                          Add Service
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddService(false)} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {trainerData.services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <p className="text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-semibold text-blue-600">{service.price}</span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </span>
                        </div>
                      </div>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Client Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainerData.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    <p className="text-sm text-gray-500 mt-2">- {testimonial.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={trainerData.email}
                        onChange={(e) => setTrainerData((prev) => ({ ...prev, email: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={trainerData.phone}
                        onChange={(e) => setTrainerData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={trainerData.location}
                        onChange={(e) => setTrainerData((prev) => ({ ...prev, location: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{trainerData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{trainerData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{trainerData.location}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold">{trainerData.experience}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clients Trained</span>
                  <span className="font-semibold">150+</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold">95%</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className="font-semibold">4</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Ready to Start?</h3>
                  <p className="text-sm text-gray-600 mb-4">Book a consultation to discuss your fitness goals</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Schedule Consultation</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
