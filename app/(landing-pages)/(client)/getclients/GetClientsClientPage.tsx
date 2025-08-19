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
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
