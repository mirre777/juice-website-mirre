"use client"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Star } from "lucide-react"
import { useState } from "react"
import { allTrainers, featuredTrainers, specialties } from "../(marketplace-trainers)"


export default function MarketplaceClientPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const matchesFilters = (trainer: { name: string; location?: string; specialties: string[] }) => {
    const matchesSearch = !normalizedQuery
      ? true
      : [trainer.name, trainer.location, ...(trainer.specialties || [])]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(normalizedQuery))

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      (trainer.specialties || []).some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase())

    return matchesSearch && matchesSpecialty
  }

  const filteredFeatured = featuredTrainers.filter(matchesFilters)
  const filteredAll = allTrainers.filter(matchesFilters)

  const goToMicrosite = (trainer: { slug: string; id: string }) => {
    const url = `https://app.juice.fitness/trainer-profile/${trainer.slug}?source=marketplace&trainerId=${encodeURIComponent(trainer.id)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Temporary debug logs
  console.log('allTrainers:', allTrainers.map((t) => t?.name))
  console.log('featuredTrainers:', featuredTrainers.map((t) => t?.name))

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20 pb-16 px-4">
          <section className="w-full max-w-7xl mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Personal Trainer <span className="bg-[#CDFF00] text-black px-3 py-1 inline-block">Marketplace</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with{" "}
                <span className="bg-[#CDFF00]/20 text-foreground px-1">certified fitness professionals</span>. Find the{" "}
                <span className="bg-[#CDFF00]/20 text-foreground px-1">perfect trainer</span> for your goals and budget.
              </p>

              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search trainers by name, specialty, or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button size="lg" className="bg-black text-white hover:bg-black/90">
                  Search Trainers
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={
                      selectedSpecialty === specialty
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "hover:bg-muted/50"
                    }
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Featured Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => goToMicrosite(trainer)}
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
                      <p className="text-xs text-muted-foreground mb-1">{trainer.location}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{trainer.specialties.join(" • ")}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{trainer.rating}</span>
                        <span className="text-sm text-muted-foreground">({trainer.reviews})</span>
                      </div>
                      <span className="text-lg font-bold">€{trainer.hourlyRate}/hr</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="w-full max-w-7xl mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">All Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAll.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => goToMicrosite(trainer)}
                  role="button"
                  aria-label={`Open ${trainer.name} microsite`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                    <img
                      src={trainer.image || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="font-bold mb-0.5">{trainer.name}</h3>
                    {trainer.location && (
                      <p className="text-[11px] text-muted-foreground mb-1">{trainer.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{trainer.specialties.join(" • ")}</p>
                    <div className="flex items-center justify-between text-sm mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{trainer.rating}</span>
                      </div>
                      <span className="font-bold">€{trainer.hourlyRate}/hr</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
