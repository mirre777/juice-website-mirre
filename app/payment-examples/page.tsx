"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PaymentExample } from "@/components/payment-example"
import { useTheme } from "@/components/theme-provider"

export default function PaymentExamplesPage() {
  const { isCoach } = useTheme()

  return (
    <main className={`min-h-screen ${isCoach ? "bg-white" : "bg-black"} text-white`}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isCoach ? "text-black" : "text-white"}`}>
              Payment Integration Examples
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mb-8">
              Different ways to integrate QR code payments into your application
            </p>
          </div>
        </div>
      </section>

      {/* Payment Examples */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <PaymentExample />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
