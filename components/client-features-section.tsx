"use client"

export function ClientFeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Personal trainer section */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">🏋️ Personal trainer, zonder sportschool</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Wil je sporten met een personal trainer maar liever niet naar de gym? Onze fitness app koppelt je aan een
            gecertificeerde personal trainer aan huis of online.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Geen druk, geen vaste tijden. Jij kiest.</p>
        </div>

        {/* App features */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">📲 Alles in één app</h2>
          <p className="text-xl text-gray-600 mb-8">De workout app bevat:</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schema's op maat</h3>
              <p className="text-gray-600">Van jouw doel</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Video-workouts</h3>
              <p className="text-gray-600">Voor thuis</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1-op-1 contact</h3>
              <p className="text-gray-600">Met je fitness trainer</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Gratis oefeningen</h3>
              <p className="text-gray-600">Voor beginners</p>
            </div>
          </div>

          <p className="text-lg text-gray-600 mt-8 max-w-2xl mx-auto">
            Keuze uit de beste fitness apps functies, zonder poespas
          </p>
        </div>

        {/* Pricing section */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">💶 Wat kost een personal trainer?</h2>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">🎯 Waarom onze app werkt</h2>

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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">📥 Start vandaag</h2>

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
