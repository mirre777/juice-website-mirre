"use client"

export function ClientHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
          Persoonlijke <span className="juice-text-gradient">fitness app</span>
          <br />
          zonder gedoe
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Train met een personal trainer of zelfstandig. Waar en wanneer jij wil.
        </p>

        {/* Star Rating */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600">5/5 door onze gebruikers</span>
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

      {/* Phone mockup */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10">
        <div className="w-64 h-96 bg-gray-300 rounded-3xl"></div>
      </div>
    </section>
  )
}
