"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ClientHeroSectionProps {
  title: string
  subtitle: string
  rating: string
  ctaText: string
}

export function ClientHeroSection({ title, subtitle, rating, ctaText }: ClientHeroSectionProps) {
  const titleParts = title.split(" - ")
  const mainTitle = titleParts[0] || title
  const titleSubtitle = titleParts[1] || ""

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-2 text-black">
          {mainTitle
            .replace("3-Day", "3 Day")
            .split(" ")
            .map((word, index) =>
              word.toLowerCase().includes("fitness") || word.toLowerCase().includes("app") ? (
                <span key={index} className="juice-text-gradient">
                  {word}{" "}
                </span>
              ) : (
                <span key={index} className="text-black" style={{ color: "#000000" }}>
                  {word}{" "}
                </span>
              ),
            )}
        </h1>

        {titleSubtitle && <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-600">{titleSubtitle}</h2>}

        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>

        {/* Star Rating */}

        <div className="flex justify-center items-center gap-4 overflow-x-auto pb-4">
          <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
            <img
              src="/images/import-program.png"
              alt="Import workout program screen"
              className="w-48 h-auto rounded-lg border-0 bg-transparent"
              style={{ backgroundColor: "transparent", border: "none", outline: "none" }}
            />
            <div className="absolute inset-2 bg-[#D2FF28] bg-opacity-60 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Check className="w-12 h-12 text-[#D2FF28]" strokeWidth={3} />
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm text-black font-medium">We already created a program for you!</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src="/images/workout-program.png"
              alt="Workout program overview screen"
              className="w-48 h-auto rounded-lg border-0 bg-transparent"
              style={{ backgroundColor: "transparent", border: "none", outline: "none" }}
            />
          </div>
          <div className="flex-shrink-0">
            <img
              src="/images/workout-logging.png"
              alt="Workout logging screen"
              className="w-48 h-auto rounded-lg border-0 bg-transparent"
              style={{ backgroundColor: "transparent", border: "none", outline: "none" }}
            />
          </div>
          <div className="flex-shrink-0">
            <img
              src="/images/statistics.png"
              alt="Statistics and progress screen"
              className="w-48 h-auto rounded-lg border-0 bg-transparent"
              style={{ backgroundColor: "transparent", border: "none", outline: "none" }}
            />
          </div>
        </div>

        <div className="mt-12 pt-8">
          <Button
            asChild
            size="lg"
            className="bg-[#D2FF28] hover:bg-[#c4f01f] text-black font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <a
              href="https://app.juice.fitness/public/programs/76d24001-bf04-40d1-8976-fa20c93a30cc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Get Free Program
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <p className="text-sm text-gray-500 mt-3">Access your complete workout program instantly</p>
        </div>
      </div>
    </section>
  )
}
