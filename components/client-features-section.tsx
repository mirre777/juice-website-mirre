"use client"

import Image from "next/image"

export function ClientFeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Personal trainer section */}
        <div className="text-center mb-40">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Für Einsteiger und Fortgeschrittene</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Du willst fitter werden, ohne Vertrag und ohne Studio? Unsere Fitness App kostenlos bringt dir Workouts,
            Trainingspläne und Fortschrittskontrolle direkt auf dein Smartphone.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Funktioniert zuhause, draußen oder im Gym.</p>
        </div>

        {/* Features grid section */}
        <div className="text-center mb-40">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Warum diese App?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Kostenlos starten</h3>
              <p className="text-gray-600">Kostenlose Fitness App mit Übungen für jedes Level</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Individueller Plan</h3>
              <p className="text-gray-600">Trainingsplan App für Kraft, Ausdauer oder HIIT</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Online & Offline</h3>
              <p className="text-gray-600">Nutze die App online oder als Fitness Online App offline verfügbar</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-black">Transparent</h3>
              <p className="text-gray-600">Keine Werbung, kein Abo, volle Kontrolle</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-lime-50 to-green-50 p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-black">Motivation inklusive</h3>
            <p className="text-gray-700">Motivation durch Fortschrittsanzeige und Tipps vom Trainer</p>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Jetzt kostenlos starten</h2>

          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700">Hol dir die App und trainiere zuhause, ohne Abo und ohne Grenzen.</p>
            <p className="text-lg text-gray-600">Kostenlos starten, jederzeit erweiterbar</p>
            <p className="text-lg text-gray-600">Transparent: keine versteckten Kosten</p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_US-UK_RGB_blk.svg"
                alt="Download on the App Store"
                width={200}
                height={60}
                className="h-14 w-auto"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=fitness.beta.juice"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width={200}
                height={60}
                className="h-14 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
