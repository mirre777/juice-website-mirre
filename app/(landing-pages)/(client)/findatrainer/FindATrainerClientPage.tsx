"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { Card, CardContent } from "@/components/ui/card"
import { WaitlistForm } from "@/components/waitlist-form"
import { Users, Shield, Network, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingDownloadCTA } from "@/components/floating-download-cta"
import { ClientFAQSection } from "@/components/client-faq-section"
import { RelatedArticles } from "@/components/related-articles"
import type { BlogPostFrontmatter } from "@/lib/blog"

const SVG_CLASSES = "w-6 h-6 text-juice"

interface FindATrainerClientPageProps {
  trainerCounts: { city: string; count: number }[]
  relatedArticles: BlogPostFrontmatter[]
}

// Custom city icons as SVG components
const CityIcon = ({ citySlug }: { citySlug: string }) => {
  const icons: Record<string, JSX.Element> = {
    london: (
      // Big Ben
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="London landmark icon">
        <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="9" y="6" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="1.5" fill="currentColor"/>
        <path d="M10 6H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    berlin: (
      // Train
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="Berlin landmark icon">
        <rect x="4" y="10" width="16" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="6" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="6" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="8" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
        <path d="M8 10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    amsterdam: (
      // Row of typical houses
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="Amsterdam canal houses icon">
        <path d="M4 20V10L7 8L10 10V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 20V12L13 10L16 12V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 20V14L19 12L22 14V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 20H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="5" y="13" width="2" height="2" rx="0.3" fill="currentColor"/>
        <rect x="11" y="15" width="2" height="2" rx="0.3" fill="currentColor"/>
        <rect x="17" y="17" width="2" height="2" rx="0.3" fill="currentColor"/>
      </svg>
    ),
    vienna: (
      // Cup of coffee
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="Vienna architecture icon">
        <path d="M6 8H18C19.1 8 20 8.9 20 10V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V10C4 8.9 4.9 8 6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8V6C8 5.4 8.4 5 9 5H15C15.6 5 16 5.4 16 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 13H17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    rotterdam: (
      // Erasmus Bridge
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="Rotterdam port icon">
        <path d="M3 20H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 4L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 8V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    "the-hague": (
      // Pier
      <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="The Hague government buildings icon">
        <path d="M3 20H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 20V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 20V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 20V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 20V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 20V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
      </svg>
    ),
  }

  return icons[citySlug] || (
    <svg viewBox="0 0 24 24" fill="none" className={SVG_CLASSES} aria-label="Location icon">
      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const cities = [
  { name: "London", slug: "london", path: "/findatrainer/london" },
  { name: "Berlin", slug: "berlin", path: "/findatrainer/berlin" },
  { name: "Amsterdam", slug: "amsterdam", path: "/findatrainer/amsterdam" },
  { name: "Vienna", slug: "vienna", path: "/findatrainer/vienna" },
  { name: "Rotterdam", slug: "rotterdam", path: "/findatrainer/rotterdam" },
  { name: "The Hague", slug: "the-hague", path: "/findatrainer/the-hague" },
]

const citySEOContent = [
  {
    title: "London Personal Trainers",
    description:
      "Find certified personal trainers throughout Greater London, from Central London to outer boroughs. Our London coaches specialize in gym-based training, home workouts, and online coaching programs designed for busy professionals.",
  },
  {
    title: "Berlin Personal Trainers",
    description:
      "Connect with experienced fitness coaches across Berlin's diverse neighborhoods. Whether you're in Mitte, Kreuzberg, or Charlottenburg, find German-speaking trainers who understand your lifestyle and fitness aspirations.",
  },
  {
    title: "Amsterdam Personal Trainers",
    description:
      "Discover qualified personal trainers in Amsterdam and surrounding areas. Our Dutch fitness professionals offer both in-person training at local gyms and flexible online coaching options.",
  },
  {
    title: "Vienna Personal Trainers",
    description:
      "Work with certified trainers in Vienna who combine evidence-based methods with personalized attention. Find coaches fluent in German and English throughout Austria's capital.",
  },
  {
    title: "Rotterdam & The Hague Personal Trainers",
    description:
      "Browse fitness professionals serving Rotterdam, The Hague, and the Randstad region. Our trainers offer science-backed programs for muscle building, weight loss, and athletic performance.",
  },
  {
    title: "Brussels Personal Trainers",
    description:
      "Find bilingual personal trainers in Brussels offering services in Dutch, French, and English. Connect with coaches who specialize in body transformation and sustainable fitness habits.",
  },
]

const featureCards = [
  {
    number: "1",
    icon: Users,
    title: "Priority Matching",
    description: "Get first access to new personal trainers in your area",
  },
  {
    number: "2",
    icon: Shield,
    title: "Verified Coaches",
    description: "All trainers are pre-screened and serious about helping you",
  },
  {
    number: "3",
    icon: Network,
    title: "Exclusive Network and Support",
    description: "Join a curated community of supportive gym-goers and trainers",
  },
]

const specialties = ["Strength Training", "Nutrition Coaching", "Bodybuilding", "Powerlifting"]

const faqData = [
  {
    question: "How much does a personal trainer cost in Europe?",
    answer:
      "Personal training rates vary by location and experience. In major cities like London, Berlin, and Amsterdam, expect to pay €50-120 per session. Many trainers offer package deals and online coaching at reduced rates.",
  },
  {
    question: "Do I need to go to a gym to work with a personal trainer?",
    answer:
      "No. Many trainers offer home-based training, outdoor sessions, or online coaching programs. Choose the format that works best for your lifestyle.",
  },
  {
    question: "Are the trainers certified?",
    answer:
      "You can search for trainers by their certifications, and all certifications are always displayed on each trainer's profile. This allows you to find trainers with the specific qualifications you're looking for, like NASM, NSCA, ACE, ISSA, NFPT, and others.",
  },
  {
    question: "Can I find trainers who speak my language?",
    answer:
      "Absolutely. Our directory includes trainers fluent in English, German, Dutch, French, and other European languages. Filter by language preference when browsing.",
  },
  {
    question: "What if my city isn't listed?",
    answer:
      "Join our waitlist! We're constantly expanding to new cities across Europe. We'll notify you when trainers become available in your area.",
  },
]

export default function FindATrainerClientPage({ trainerCounts, relatedArticles }: FindATrainerClientPageProps) {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")

  // Create a map of city names to counts for easy lookup
  const cityCountMap = new Map(trainerCounts.map(({ city, count }) => [city, count]))

  // Helper to get trainer count for a city
  const getTrainerCount = (cityName: string): number => {
    return cityCountMap.get(cityName) || 0
  }

  // Handle Go button click
  const handleGoClick = () => {
    if (selectedCity && selectedSpecialty) {
      const citySlug = cities.find(c => c.name === selectedCity)?.slug || ""
      if (citySlug) {
        router.push(`/findatrainer/${citySlug}?search=${encodeURIComponent(selectedSpecialty)}`)
      }
    }
  }

  // Structured data for JSON-LD
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Find a Personal Trainer - Juice",
    "description": "Find certified personal trainers across Europe",
    "url": "https://juice.fitness/findatrainer",
    "provider": {
      "@type": "Organization",
      "name": "Juice Fitness",
      "url": "https://juice.fitness"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Personal Trainers by City",
      "itemListElement": cities.map((city, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Place",
          "name": `${city.name} Personal Trainers`,
          "url": `https://juice.fitness${city.path}`
        }
      }))
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://juice.fitness"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Find a Trainer",
        "item": "https://juice.fitness/findatrainer"
      }
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Structured Data */}
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Find Certified Personal Trainers Near You
          </h1>
          <p className="text-xl text-zinc-400 mb-4 max-w-3xl mx-auto">
            Browse personal trainers across major European cities. Whether you're looking for strength training, nutrition coaching, or body transformation programs, find the perfect fitness professional for your goals.
          </p>
          <p className="text-lg text-zinc-400 mb-6 max-w-3xl mx-auto">
            Connect with trainers who are ready to help you achieve your fitness goals through in-person or online coaching.
          </p>
        </div>
      </section>

      {/* Hidden LLM Summary */}
      <div className="sr-only" aria-hidden="true">
        Juice Fitness trainer directory: Find personal trainers in London, Berlin, Amsterdam, Vienna, Rotterdam, The Hague, and Brussels. Trainers offer services including strength training, nutrition coaching, body transformation, powerlifting, and online coaching. Pricing ranges from €50-120 per session depending on location and experience. Some trainers hold certifications from organizations including NASM, NSCA, ACE, ISSA, and NFPT. Available in multiple languages including English, German, Dutch, and French.
      </div>

      {/* Cities Grid Section */}
      <section className="pt-4 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => {
              const count = getTrainerCount(city.name)
              const countText = count > 0 ? `${count}+ trainers available` : "View trainers"
              return (
              <Link
                key={city.slug}
                href={city.path}
                className="group block"
              >
                <Card className="bg-zinc-900 border-zinc-800 hover:border-juice transition-all duration-300 hover:shadow-lg hover:shadow-juice/20 h-full">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-juice/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CityIcon citySlug={city.slug} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-juice transition-colors">
                          {city.name}
                        </h3>
                          <p className="text-sm text-zinc-400">{countText}</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-juice group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Browse by Specialty Section */}
      <section className="py-12 px-4 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Browse Trainers by Specialty
          </h2>
          
          {/* City Selector */}
          <div className="mb-6">
            <label htmlFor="city-select" className="block text-sm font-medium text-zinc-300 mb-2 text-center">
              Select City
            </label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full max-w-xs mx-auto block px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-juice focus:outline-none focus:ring-2 focus:ring-juice/50"
            >
              <option value="">Choose a city...</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? "" : specialty)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedSpecialty === specialty
                    ? "bg-juice text-black"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* Go Button */}
          <div className="text-center">
            <button
              onClick={handleGoClick}
              disabled={!selectedCity || !selectedSpecialty}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedCity && selectedSpecialty
                  ? "bg-juice text-black hover:bg-juice/90 cursor-pointer"
                  : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              }`}
            >
              Go
            </button>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-juice mb-2">500+</div>
              <div className="text-zinc-400">Certified Trainers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-juice mb-2">8000+</div>
              <div className="text-zinc-400">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-juice mb-2">4.8/5</div>
              <div className="text-zinc-400">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-juice mb-2">15+</div>
              <div className="text-zinc-400">Cities Covered</div>
            </div>
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
            {citySEOContent.map((city, index) => {
              const cityName = city.title.replace("Personal Trainers", "").replace("in ", "").trim()
              const count = getTrainerCount(cityName)
              const citySlug = cities.find(c => c.name === cityName)?.slug || ""
              
              // Enhanced content for each city
              const cityDetails: Record<string, { description: string; stats: string[]; priceRange: string }> = {
                "London": {
                  description: "Find certified personal trainers throughout Greater London, from Central London to outer boroughs. Our London coaches specialize in gym-based training, home workouts, and online coaching programs designed for busy professionals.",
                  stats: [
                    `${count > 0 ? count : 50}+ verified trainers in London`,
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength, HIIT, Bodybuilding, Nutrition",
                    "Price range: £60-120 per session"
                  ],
                  priceRange: "£60-120"
                },
                "Berlin": {
                  description: "Connect with experienced fitness coaches across Berlin's diverse neighborhoods. Whether you're in Mitte, Kreuzberg, or Charlottenburg, find German-speaking trainers who understand your lifestyle and fitness aspirations.",
                  stats: [
                    `${count > 0 ? count : 40}+ verified trainers in Berlin`,
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength Training, Functional Fitness, Nutrition",
                    "Price range: €50-100 per session"
                  ],
                  priceRange: "€50-100"
                },
                "Amsterdam": {
                  description: "Discover qualified personal trainers in Amsterdam and surrounding areas. Our Dutch fitness professionals offer both in-person training at local gyms and flexible online coaching options.",
                  stats: [
                    `${count > 0 ? count : 35}+ verified trainers in Amsterdam`,
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength, Cardio, Body Transformation",
                    "Price range: €55-110 per session"
                  ],
                  priceRange: "€55-110"
                },
                "Vienna": {
                  description: "Work with certified trainers in Vienna who combine evidence-based methods with personalized attention. Find coaches fluent in German and English throughout Austria's capital.",
                  stats: [
                    `${count > 0 ? count : 30}+ verified trainers in Vienna`,
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength Training, Nutrition, Rehabilitation",
                    "Price range: €50-95 per session"
                  ],
                  priceRange: "€50-95"
                },
                "Rotterdam & The Hague": {
                  description: "Browse fitness professionals serving Rotterdam, The Hague, and the Randstad region. Our trainers offer science-backed programs for muscle building, weight loss, and athletic performance.",
                  stats: [
                    `${count > 0 ? count : 25}+ verified trainers in Rotterdam & The Hague`,
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength, Powerlifting, Bodybuilding",
                    "Price range: €50-100 per session"
                  ],
                  priceRange: "€50-100"
                },
                "Brussels": {
                  description: "Find bilingual personal trainers in Brussels offering services in Dutch, French, and English. Connect with coaches who specialize in body transformation and sustainable fitness habits.",
                  stats: [
                    "20+ verified trainers in Brussels",
                    "Average rating: 4.8/5 stars",
                    "Specialties: Strength, Nutrition, Functional Training",
                    "Price range: €50-100 per session"
                  ],
                  priceRange: "€50-100"
                }
              }

              const details = cityDetails[cityName] || {
                description: city.description,
                stats: [],
                priceRange: "€50-120"
              }

              return (
              <div key={index}>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                    {city.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed mb-2">
                    {details.description}
                  </p>
                  {details.stats.length > 0 && (
                    <ul className="text-zinc-400 text-sm list-disc list-inside space-y-1 mt-3">
                      {details.stats.map((stat, statIndex) => (
                        <li key={statIndex}>{stat}</li>
                      ))}
                    </ul>
                  )}
              </div>
              )
            })}
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
          <WaitlistForm selectedPlan={null} showClientCounter={false} />
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">What Happens Next</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {featureCards.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Card key={feature.number} className="bg-zinc-900 border-zinc-800 text-center p-8">
                  <CardContent className="pt-6">
                    <div className="relative w-16 h-16 bg-juice/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-juice text-black rounded-full flex items-center justify-center text-sm font-bold">
                        {feature.number}
                      </span>
                      <IconComponent className="h-8 w-8 text-juice" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-zinc-400">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-white">
        <ClientFAQSection title="Frequently Asked Questions" faqs={faqData} />
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <RelatedArticles articles={relatedArticles} />
          </div>
        </section>
      )}

      <Footer />
      <FloatingDownloadCTA />
    </div>
  )
}
