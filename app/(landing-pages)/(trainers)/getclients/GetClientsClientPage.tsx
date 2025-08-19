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
            {/* Removed the container divs */}
            <div className="max-w-sm mx-auto">
              {" "}
              {/* Added a new, simpler div for centering and max-width */}
              <WaitlistForm selectedPlan="trainer-marketplace-interest" />
            </div>
          </section>

          <section className="w-full max-w-4xl px-6 py-16 space-y-16">
            {/* Main intro section */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Find Clients as a Personal Trainer with Juice Marketplace
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                Struggling to find new clients as a personal trainer? Juice Marketplace connects elite trainers with
                motivated clients looking for expert guidance. Whether you coach in-person or online, our platform helps
                you get discovered, build your business, and grow faster.
              </p>
            </div>

            {/* Why Join section */}
            

            {/* Who is it for section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Who Is Juice Marketplace For?</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <p className="text-zinc-300">Personal Trainers wanting steady clients</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <p className="text-zinc-300">Fitness Coaches offering online programs</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <p className="text-zinc-300">Strength & Conditioning Experts looking to expand reach</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-lg">
                  <p className="text-zinc-300">Group Class Trainers seeking motivated participants</p>
                </div>
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

            {/* Testimonial section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Testimonials & Proof</h2>
              <div className="bg-zinc-900 p-8 rounded-lg max-w-2xl mx-auto">
                <p className="text-lg text-zinc-300 italic mb-4">
                  "Since joining Juice Marketplace, I've added 5 new clients in my first month."
                </p>
                <p className="text-zinc-400">– Trainer in Amsterdam</p>
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
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
