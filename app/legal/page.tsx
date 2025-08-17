import { ClientTabHandler } from "./client-tab-handler"

export const metadata = {
  title: "Juice Legal Information | Terms of Service & Privacy Policy",
  description:
    "Review Juice's official terms of service, privacy policy, and other legal documents for our fitness tracking and coaching platform.",
  openGraph: {
    images: "/images/og-feature-graphic.png",
  },
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Legal Information</h1>
            <p className="text-zinc-400 text-lg">Our commitment to transparency and your rights</p>
          </div>

          <ClientTabHandler />
        </div>
      </div>
    </div>
  )
}
