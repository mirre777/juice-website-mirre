"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useTheme } from "@/components/theme-provider"
import { NewHomepageHeroSection } from "../components/homepage/new-homepage-hero-section"
import { TestimonialsSection } from "../components/homepage/new-homepage-testimonials-section"
import { StatisticsSection } from "../components/homepage/new-homepage-statistics-section"
import { NewHowItWorksSection } from "../components/homepage/new-homepage-how-it-works-section"
import { EverythingYouNeedSection } from "../components/homepage/new-homepage-everything-you-need-section"
import { MobileAppSection } from "../components/homepage/new-homepage-mobile-app-section"
import { HomepageFAQSection } from "../components/homepage/new-homepage-faq-section"
import { FoundersSection } from "../components/homepage/new-homepage-founders-section"
import {
  HOMEPAGE_IMAGES,
  trainerProfiles,
  trainerTestimonials,
  clientTestimonials,
  statistics,
  steps,
  features,
  mobileAppFeatures,
  faqs,
} from "../utils/new-homepage-data"

export default function NewHomePage() {
  const { setIsCoach } = useTheme()

  // Set to trainer mode
  useEffect(() => {
    setIsCoach(true)
  }, [setIsCoach])

  const handleDemoClick = () => {
    window.location.href = "/demo"
  }

  const handleAppRedirect = () => {
    window.location.href = "https://app.juice.fitness/"
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <NewHomepageHeroSection
        trainerProfiles={trainerProfiles}
        laptopImageUrl={HOMEPAGE_IMAGES.laptop}
        phoneImageUrl={HOMEPAGE_IMAGES.phone}
        onDemoClick={handleDemoClick}
        onStartFreeClick={handleAppRedirect}
      />

      {/* Trainer Testimonials */}
      <TestimonialsSection
        type="trainer"
        title="What Trainers Are Saying"
        testimonials={trainerTestimonials}
        cta={{
          text: "Start now",
          onClick: handleAppRedirect,
          subText: "No credit card required. Get started in minutes.",
        }}
      />

      {/* Statistics */}
      <StatisticsSection statistics={statistics} />

      {/* How It Works */}
      <NewHowItWorksSection steps={steps} onDemoClick={handleDemoClick} onTryItClick={handleAppRedirect} />

      {/* Everything You Need */}
      <EverythingYouNeedSection features={features} />

      {/* Client Testimonials */}
      <TestimonialsSection
        type="client"
        title="What Clients Are Saying"
        testimonials={clientTestimonials}
        cta={{
          text: "Add Your Clients Now",
          onClick: handleAppRedirect,
          subText: "No credit card required. Get started in minutes.",
        }}
      />

      {/* Mobile App Section */}
      <MobileAppSection features={mobileAppFeatures} phoneImageUrl={HOMEPAGE_IMAGES.phone} />

      {/* FAQ Section */}
      <HomepageFAQSection faqs={faqs} />

      {/* Founders Section */}
      <FoundersSection onTryItClick={handleAppRedirect} onDemoClick={handleDemoClick} />

      <Footer />
    </main>
  )
}
