"use client"

import { useState } from "react"
import Link from "next/link"
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
            Find a Personal Trainer{" "}
            <br className="hidden md:block" />
            near you
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto">
            Find your perfect match and start your fitness journey today.
          </p>
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

      {/* SEO Content - General Europe */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Connect with Expert Personal Trainers Across Europe
          </h2>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            Whether you're in London, Berlin, Amsterdam, Vienna, or Brussels, finding the right personal trainer has never been easier. Juice connects you with certified fitness professionals who specialize in strength training, nutrition coaching, body recomposition, and personalized workout programs tailored to your goals.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Our directory features verified personal trainers in major cities across the UK, Germany, Austria, the Netherlands, and Belgium. From powerlifting coaches to nutrition specialists, find experienced professionals who can help you build muscle, lose fat, and achieve your fitness goals.
          </p>
        </div>
      </section>

      {/* SEO Content - City Specific */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
            Personal Trainers in Your City
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">London Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Find certified personal trainers throughout Greater London, from Central London to outer boroughs. Our London coaches specialize in gym-based training, home workouts, and online coaching programs designed for busy professionals.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Berlin Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Connect with experienced fitness coaches across Berlin's diverse neighborhoods. Whether you're in Mitte, Kreuzberg, or Charlottenburg, find German-speaking trainers who understand your lifestyle and fitness aspirations.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Amsterdam Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Discover qualified personal trainers in Amsterdam and surrounding areas. Our Dutch fitness professionals offer both in-person training at local gyms and flexible online coaching options.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Vienna Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Work with certified trainers in Vienna who combine evidence-based methods with personalized attention. Find coaches fluent in German and English throughout Austria's capital.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Rotterdam & The Hague Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Browse fitness professionals serving Rotterdam, The Hague, and the Randstad region. Our trainers offer science-backed programs for muscle building, weight loss, and athletic performance.
              </p>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">Brussels Personal Trainers</h3>
              <p className="text-zinc-400 leading-relaxed">
                Find bilingual personal trainers in Brussels offering services in Dutch, French, and English. Connect with coaches who specialize in body transformation and sustainable fitness habits.
              </p>
            </div>
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
                <div className="relative w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-juice text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <Users className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Priority Matching</h3>
                <p className="text-zinc-400">Get first access to new personal trainers in your area</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="relative w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-juice text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <Shield className="h-8 w-8 text-juice" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Verified Coaches</h3>
                <p className="text-zinc-400">All trainers are pre-screened and serious about helping you</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-center p-8">
              <CardContent className="pt-6">
                <div className="relative w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-juice text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
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
