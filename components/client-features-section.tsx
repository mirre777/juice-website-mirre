"use client"

export function ClientFeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Personal trainer section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Personal trainer, zonder sportschool</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Wil je sporten met een personal trainer maar liever niet naar de gym? Onze fitness app koppelt je aan een
            gecertificeerde personal trainer aan huis of online.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Geen druk, geen vaste tijden. Jij kiest.</p>
        </div>

        {/* Pricing section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Wat kost een personal trainer?</h2>
          <p className="text-xl text-gray-600 mb-8">Via onze app bepaal jij zelf:</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Zelfstandig trainen</h3>
              <p className="text-3xl font-bold text-green-600 mb-4">Gratis</p>
              <p className="text-gray-600">Workout app</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Begeleiding</h3>
              <p className="text-lg font-semibold text-blue-600 mb-4">Betaal per sessie</p>
              <p className="text-gray-600">Geen abonnement</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 mt-8 max-w-2xl mx-auto">
            Zo weet je vooraf altijd wat je betaalt. Geen verrassingen.
          </p>
        </div>

        {/* Why it works section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Waarom onze app werkt</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-lg text-gray-700">Combineert gratis app fitness met personal coaching</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700">Geen lange contracten</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700">Resultaten te volgen in de app</p>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700">Kies zelf: thuis trainen, buiten of in de gym</p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Start vandaag</h2>

          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700">Download de app.</p>
            <p className="text-xl text-gray-700">Train met of zonder personal trainer.</p>
            <p className="text-xl text-gray-700">Gratis starten, jij bepaalt de rest.</p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18l7-7h-4V5H7v6H3l7 7z" />
              </svg>
              Download voor iOS
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=fitness.beta.juice"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18l7-7h-4V5H7v6H3l7 7z" />
              </svg>
              Download voor Android
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
