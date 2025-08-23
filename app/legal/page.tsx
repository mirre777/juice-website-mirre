import { Suspense } from "react"
import { LegalContent } from "./legal-content"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Juice Legal Information | Terms of Service & Privacy Policy",
  description:
    "Review Juice's official terms of service, privacy policy, and other legal documents for our fitness tracking and coaching platform.",
  openGraph: {
    images: "/images/og-feature-graphic.png",
  },
}

interface LegalPageProps {
  searchParams: { tab?: string }
}

export default function LegalPage({ searchParams }: LegalPageProps) {
  const activeTab =
    searchParams.tab && ["terms", "privacy", "cookie", "gdpr"].includes(searchParams.tab) ? searchParams.tab : "terms"

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Legal Information</h1>
            <p className="text-zinc-400 text-lg">Our commitment to transparency and your rights</p>
          </div>

          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <LegalContent initialTab={activeTab} />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  )
}
