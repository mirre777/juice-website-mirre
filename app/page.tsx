import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { BenefitsSection } from "@/components/benefits-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar isHomePage={true} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <BenefitsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
