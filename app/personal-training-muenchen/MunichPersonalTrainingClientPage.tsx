"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const MunichPersonalTrainingClientPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleExplicitSubmit = () => {
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Personal Training München</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <section className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Willkommen bei unserem Personal Training in München</h2>
          <p className="text-gray-600 mb-8">
            Wir bieten Ihnen individuelle Trainingsprogramme, um Ihre Fitnessziele zu erreichen.
          </p>
          <button
            onClick={() => {
              const formSection = document.getElementById("coach-finder-form")
              if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth" })
              }
            }}
            className="bg-[#c4ff4d] hover:bg-[#b8f041] text-black font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Gratis Probetraining
            <ChevronDown className="w-5 h-5" />
          </button>
        </section>

        {/* Hero Section */}
        <section className="bg-cover bg-center h-screen relative">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Finden Sie Ihren idealen Coach</h2>
              <p className="text-xl text-white mb-8">
                Unsere erfahrenen Coaches helfen Ihnen gerne dabei, Ihre Fitnessziele zu erreichen.
              </p>
              {/* Form Section */}
              <div id="coach-finder-form" className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Coach Finder</h3>
                <form>
                  {/* Form Fields */}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleExplicitSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#c4ff4d] hover:bg-[#b8f041] text-black font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Wird gesendet..." : "Absenden"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MunichPersonalTrainingClientPage
