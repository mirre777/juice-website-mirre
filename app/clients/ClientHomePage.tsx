"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ClientWaitlistForm } from "@/components/client-waitlist-form"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSectionWithPayment } from "@/components/pricing-section-with-payment"
import { BenefitsSection } from "@/components/benefits-section"
import { scrollToSection } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function ClientHomePage() {
  const { setIsCoach } = useTheme()
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")
  const waitlistRef = useRef<HTMLDivElement>(null)

  // Set to client mode
  useEffect(() => {
    setIsCoach(false)
  }, [setIsCoach])

  // Handle hash links on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1)
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash)
        }, 500)
      }
    }
  }, [])

  const handleWaitlistClick = () => {
    setShowWaitlist(true)
    setTimeout(() => {
      if (waitlistRef.current) {
        waitlistRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="mb-6 max-w-4xl mx-auto text-center">
            <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Simplify <span className="text-[#D2FF28]">Training.</span>
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Super simple workout logging. Get insights into your training. Share your workouts.
          </p>

          <div className="flex flex-col items-center gap-6 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_US-UK_RGB_blk.svg"
                  alt="Download on the App Store"
                  width={200}
                  height={60}
                  className="h-14 w-auto"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=fitness.beta.juice"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={200}
                  height={60}
                  className="h-14 w-auto"
                />
              </a>
            </div>
            <button
              onClick={handleWaitlistClick}
              className="rounded-full px-6 py-3 border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              Get updates
            </button>
          </div>

          {/* Waitlist Form */}
          {showWaitlist && (
            <div ref={waitlistRef} className="max-w-md mx-auto mb-16 animate-fadeIn">
              <div className="bg-zinc-900 border-2 border-[#D2FF28] rounded-xl overflow-hidden shadow-lg">
                <div className="bg-zinc-800 py-3 px-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">Get early access. Join the waitlist.</h3>
                  </div>
                </div>
                <div className="p-4">
                  <ClientWaitlistForm selectedPlan={selectedPlan} />
                </div>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            <div className="relative w-full overflow-hidden">
              <div className="flex justify-center py-8">
                <div className="flex justify-center items-center gap-4 overflow-x-auto pb-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/import-program.png"
                      alt="Import workout program screen"
                      width={192}
                      height={416}
                      className="w-48 h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/workout-program.png"
                      alt="Workout program overview screen"
                      width={192}
                      height={416}
                      className="w-48 h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/workout-logging.png"
                      alt="Workout logging screen"
                      width={192}
                      height={416}
                      className="w-48 h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/statistics.png"
                      alt="Statistics and progress screen"
                      width={192}
                      height={416}
                      className="w-48 h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 pt-20 pb-20">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 pt-20 pb-20">
        <HowItWorks />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 pt-20 pb-20">
        <PricingSectionWithPayment />
      </section>

      {/* Divider */}
      <div className="w-full flex justify-center">
        <div className="w-2/3 h-2 bg-juice"></div>
      </div>

      {/* Benefits Section */}
      <section id="benefits" className="scroll-mt-20 pt-20 pb-20">
        <BenefitsSection />
      </section>

      {/* Blog Call to Action Section */}
      <section className="pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl p-8 md:p-12 shadow-lg text-center bg-zinc-900">
            <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated with the Juice Blog</h2>
            <p className="text-xl text-gray-400 mb-8">
              Discover insights, tips, and the latest trends in fitness coaching and technology.
            </p>
            <Link href="/blog">
              <button className="rounded-full px-6 py-3 font-medium bg-white text-black border border-black transition-colors hover:bg-gray-100">
                Go go gadget blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Get ready to train.</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of bicep babes who are elevating their training with Juice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "https://app.juice.fitness/")}
                className="rounded-full px-6 py-3 font-medium bg-black text-white transition-colors"
              >
                Start now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
