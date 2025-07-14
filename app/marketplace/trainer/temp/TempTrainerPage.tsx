"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { toast } from "react-hot-toast"

interface TempTrainerData {
 id: string
 name: string
 email: string
 specialties: string[]
 bio: string
 experience: string
 certifications: string[]
 location: string
 pricing: {
   sessionRate: number
   packageDeals: string[]
 }
 availability: string[]
 contactInfo: {
   phone?: string
   website?: string
   social?: {
     instagram?: string
     facebook?: string
     linkedin?: string
   }
 }
 profileImage?: string
 createdAt: string
 status: "pending" | "active" | "expired"
 activationToken?: string
}

interface TempTrainerPageProps {
 tempId: string
 token?: string
}

export function TempTrainerPage({ tempId, token }: TempTrainerPageProps) {
 const [trainerData, setTrainerData] = useState<TempTrainerData | null>(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)
 const [activating, setActivating] = useState(false)

 useEffect(() => {
   fetchTempTrainer()
 }, [tempId])

 const fetchTempTrainer = async () => {
   try {
     setLoading(true)
     const response = await fetch(`/api/trainer/temp/${tempId}`)

     if (!response.ok) {
       throw new Error("Trainer profile not found")
     }

     const data = await response.json()
     setTrainerData(data)
   } catch (err) {
     setError(err instanceof Error ? err.message : "Failed to load trainer profile")
   } finally {
     setLoading(false)
   }
 }

 const handleActivateProfile = async () => {
   if (!token || !trainerData) {
     toast.error("Invalid activation token")
     return
   }

   try {
     setActivating(true)
     const response = await fetch("/api/trainer/activate", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         tempId,
         token,
       }),
     })

     if (!response.ok) {
       throw new Error("Failed to activate profile")
     }

     const result = await response.json()
     toast.success("Profile activated successfully!")

     // Redirect to the live trainer profile
     window.location.href = `/marketplace/trainer/${result.trainerId}`
   } catch (err) {
     toast.error(err instanceof Error ? err.message : "Activation failed")
   } finally {
     setActivating(false)
   }
 }

 if (loading) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center">
         <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
         <p className="text-muted-foreground">Loading trainer profile...</p>
       </div>
     </div>
   )
 }

 if (error || !trainerData) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <Card className="w-full max-w-md">
         <CardContent className="pt-6">
           <div className="text-center">
             <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
             <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
             <p className="text-muted-foreground mb-4">
               {error || "The trainer profile you're looking for doesn't exist or has expired."}
             </p>
             <Button asChild>
               <a href="/marketplace">Browse Trainers</a>
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
   )
 }

 const isExpired = trainerData.status === "expired"
 const isActive = trainerData.status === "active"
 const canActivate = token && trainerData.activationToken === token && !isActive && !isExpired

 return (
   <div className="min-h-screen bg-gray-50 py-8">
     <div className="container mx-auto px-4 max-w-4xl">
       {/* Header Alert */}
       <Alert className="mb-6">
         <AlertDescription>
           {isActive ? (
             <div className="flex items-center gap-2">
               <CheckCircle className="h-4 w-4 text-green-600" />
               This profile is now live and active on the marketplace.
             </div>
           ) : isExpired ? (
             <div className="flex items-center gap-2">
               <XCircle className="h-4 w-4 text-red-600" />
               This preview link has expired. Please create a new trainer profile.
             </div>
           ) : (
             <div className="flex items-center gap-2">
               <Loader2 className="h-4 w-4 text-blue-600" />
               This is a preview of your trainer profile. Use the activation button below to make it live.
             </div>
           )}
         </AlertDescription>
       </Alert>

       {/* Main Profile Card */}
       <Card className="mb-6">
         <CardHeader>
           <div className="flex items-start gap-4">
             <Avatar className="h-20 w-20">
               <AvatarImage src={trainerData.profileImage || "/placeholder.svg"} alt={trainerData.name} />
               <AvatarFallback className="text-lg">
                 {trainerData.name
                   .split(" ")
                   .map((n) => n[0])
                   .join("")}
               </AvatarFallback>
             </Avatar>
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                 <CardTitle className="text-2xl">{trainerData.name}</CardTitle>
                 <Badge variant={isActive ? "default" : "secondary"}>{trainerData.status}</Badge>
               </div>
               <p className="text-muted-foreground mb-2">{trainerData.location}</p>
               <div className="flex flex-wrap gap-2">
                 {trainerData.specialties.map((specialty, index) => (
                   <Badge key={index} variant="outline">
                     {specialty}
                   </Badge>
                 ))}
               </div>
             </div>
           </div>
         </CardHeader>
         <CardContent>
           <div className="space-y-6">
             {/* Bio */}
             <div>
               <h3 className="font-semibold mb-2">About</h3>
               <p className="text-muted-foreground">{trainerData.bio}</p>
             </div>

             <Separator />

             {/* Experience & Certifications */}
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <h3 className="font-semibold mb-2">Experience</h3>
                 <p className="text-muted-foreground">{trainerData.experience}</p>
               </div>
               <div>
                 <h3 className="font-semibold mb-2">Certifications</h3>
                 <ul className="space-y-1">
                   {trainerData.certifications.map((cert, index) => (
                     <li key={index} className="text-muted-foreground">
                       • {cert}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>

             <Separator />

             {/* Pricing */}
             <div>
               <h3 className="font-semibold mb-2">Pricing</h3>
               <p className="text-lg font-medium mb-2">${trainerData.pricing.sessionRate}/session</p>
               {trainerData.pricing.packageDeals.length > 0 && (
                 <div>
                   <p className="text-sm text-muted-foreground mb-1">Package Deals:</p>
                   <ul className="space-y-1">
                     {trainerData.pricing.packageDeals.map((deal, index) => (
                       <li key={index} className="text-sm text-muted-foreground">
                         • {deal}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>

             <Separator />

             {/* Availability */}
             <div>
               <h3 className="font-semibold mb-2">Availability</h3>
               <div className="flex flex-wrap gap-2">
                 {trainerData.availability.map((time, index) => (
                   <Badge key={index} variant="outline">
                     {time}
                   </Badge>
                 ))}
               </div>
             </div>

             {/* Contact Info */}
             {(trainerData.contactInfo.phone || trainerData.contactInfo.website || trainerData.contactInfo.social) && (
               <>
                 <Separator />
                 <div>
                   <h3 className="font-semibold mb-2">Contact Information</h3>
                   <div className="space-y-2">
                     {trainerData.contactInfo.phone && (
                       <p className="text-muted-foreground">Phone: {trainerData.contactInfo.phone}</p>
                     )}
                     {trainerData.contactInfo.website && (
                       <p className="text-muted-foreground">
                         Website:
                         <a
                           href={trainerData.contactInfo.website}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="ml-1 text-blue-600 hover:underline inline-flex items-center gap-1"
                         >
                           {trainerData.contactInfo.website}
                           <ExternalLink className="h-3 w-3" />
                         </a>
                       </p>
                     )}
                   </div>
                 </div>
               </>
             )}
           </div>
         </CardContent>
       </Card>

       {/* Activation Button */}
       {canActivate && (
         <Card>
           <CardContent className="pt-6">
             <div className="text-center">
               <h3 className="text-lg font-semibold mb-2">Ready to Go Live?</h3>
               <p className="text-muted-foreground mb-4">
                 Activate your profile to make it visible to clients on the marketplace.
               </p>
               <Button onClick={handleActivateProfile} disabled={activating} size="lg" className="w-full sm:w-auto">
                 {activating ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Activating Profile...
                   </>
                 ) : (
                   "Activate Profile"
                 )}
               </Button>
             </div>
           </CardContent>
         </Card>
       )}

       {/* Footer */}
       <div className="text-center mt-8 text-sm text-muted-foreground">
         <p>Created on {new Date(trainerData.createdAt).toLocaleDateString()}</p>
       </div>
     </div>
   </div>
 )
}
