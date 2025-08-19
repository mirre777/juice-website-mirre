"use client"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar" // Corrected import
import Footer from "@/components/footer"
import { WaitlistForm } from "@/components/waitlist-form" // Corrected named import

export default function GetClientsClientPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />

        <main className="flex-grow flex flex-col items-center justify-center pt-20 pb-10 px-4">
          <section className="w-full max-w-3xl text-center py-16 md:py-24">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 juice-text-gradient leading-tight">Get more clients.</h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              A curated network for elite trainers. Gain access to a growing community of clients seeking your
              expertise. Be among the first to join.
            </p>
            <div className="max-w-sm mx-auto">
              <WaitlistForm selectedPlan="trainer-marketplace-interest" />
            </div>
          </section>

          <div className="space-y-24 max-w-4xl mx-auto pt-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Find Clients as a Personal Trainer with Juice Marketplace
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-12">
                Struggling to find new clients as a personal trainer? Juice Marketplace connects elite trainers with
                motivated clients looking for expert guidance. Whether you coach in-person or online, our platform helps
                you get discovered, build your business, and grow faster.
              </p>
              <div className="max-w-3xl mx-auto">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/client%20and%20trainer%20in%20gym%20drinking%20coffee-uMwFoamOgrbeLhsUdLYsWk89kCDmkH.png"
                  alt="Personal trainer and client having coffee in a modern gym, representing the connection between trainers and clients through Juice Marketplace"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* How it works section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">How It Works</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-lime-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                    1
                  </div>
                  <p className="text-zinc-300">Enter personal data</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-lime-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                    2
                  </div>
                  <p className="text-zinc-300">Tell us a bit about yourself</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-lime-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                    3
                  </div>
                  <p className="text-zinc-300">We will match you with clients</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-lime-400 text-black rounded-full flex items-center justify-center font-bold text-xl mx-auto">
                    4
                  </div>
                  <p className="text-zinc-300">Grow your business</p>
                </div>
              </div>
            </div>

            {/* Who is it for section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">What Does Juice Offer?</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <p className="text-zinc-300">Client Matching: Personal Trainers wanting steady clients</p>
                </div>
                <a
                  href="/marketplace/personal-trainer-website"
                  className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors block"
                >
                  <p className="text-zinc-300 flex items-center justify-between">
                    Website builder: build your own page in a few clicks
                    <svg
                      className="w-5 h-5 text-zinc-500 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </a>
                <a
                  href="/download-juice-app"
                  className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors block"
                >
                  <p className="text-zinc-300 flex items-center justify-between">
                    Mobile App: your client receives your training program
                    <svg
                      className="w-5 h-5 text-zinc-500 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </a>
                <a
                  href="/workout-planner"
                  className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors block"
                >
                  <p className="text-zinc-300 flex items-center justify-between">
                    Online Platform: transform your Google sheet workout programs into something you can send your
                    client via app
                    <svg
                      className="w-5 h-5 text-zinc-500 ml-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </a>
              </div>
            </div>

            {/* Testimonial section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">What Trainers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <img src="/images/laner.png" alt="Laner" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="text-white font-medium mb-2">
                        "very easy, they just matched me with 2 new people in two days."
                      </p>
                      <p className="text-zinc-400 text-sm">- Laner</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <img src="/images/rici.png" alt="Rici" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="text-white font-medium mb-2">"Def worth the 50euros"</p>
                      <p className="text-zinc-400 text-sm">- Rici</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Get More Clients?</h2>
              <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
                👉 Join the waitlist today and be one of the first trainers to connect with clients through Juice
                Marketplace.
              </p>
              <div className="max-w-sm mx-auto">
                <WaitlistForm selectedPlan="trainer-marketplace-interest" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
