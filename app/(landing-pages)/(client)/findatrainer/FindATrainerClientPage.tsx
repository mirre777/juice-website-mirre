"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { WaitlistForm } from "@/components/waitlist-form"
import { Users, Shield, Network, MapPin, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"

const cities = [
  { name: "London", slug: "london", path: "/findatrainer/london" },
  { name: "Berlin", slug: "berlin", path: "/findatrainer/berlin" },
  { name: "Amsterdam", slug: "amsterdam", path: "/findatrainer/amsterdam" },
  { name: "Vienna", slug: "vienna", path: "/findatrainer/vienna" },
  { name: "Rotterdam", slug: "rotterdam", path: "/findatrainer/rotterdam" },
  { name: "The Hague", slug: "the-hague", path: "/findatrainer/the-hague" },
]

export default function FindATrainerClientPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Find a Personal Trainer near you
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto">
            Browse our directory of certified personal trainers in major cities across Europe. Find your perfect match and start your fitness journey today.
          </p>
        </div>
      </section>

      {/* Europe Map Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <Image
              src="https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/blog-images/europe%20trainers%20map.png"
              alt="Europe map showing cities where trainers are available"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={city.path}
                className="group block"
              >
                <Card className="bg-zinc-900 border-zinc-800 hover:border-juice transition-all duration-300 hover:shadow-lg hover:shadow-juice/20 h-full">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-juice/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-juice" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-juice transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-sm text-zinc-400">View trainers</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-juice group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Can't find your city?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Tell us where you're located and we'll notify you when trainers become available in your area.
          </p>
          
          {/* Can't find your city text */}
          <p className="text-zinc-400 text-center mb-4">
            Can't find your city? Tell us.
          </p>

          {/* Waitlist Form */}
          <WaitlistForm selectedPlan={selectedPlan} showClientCounter={false} />
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">What Happens Next</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Priority Matching</h3>
                <p className="text-zinc-400">Get first access to new personal trainers in your area</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Verified Coaches</h3>
                <p className="text-zinc-400">All trainers are pre-screened and serious about helping you</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Network className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Exclusive Network and Support</h3>
                <p className="text-zinc-400">Join a curated community of supportive gym-goers and trainers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingDownloadCTA />
    </div>
  )
}
