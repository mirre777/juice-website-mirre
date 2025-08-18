"use client"

export function ClientFAQSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">FAQ</h2>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Wat is de beste gratis fitness app in Nederland?</h3>
              <p className="text-gray-700 leading-relaxed">
                Onze app is volledig gratis te gebruiken met toegang tot workouts, schema's en progressie-tracking. Je
                betaalt alleen als je kiest voor begeleiding van een personal trainer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">
                Kan ik met een personal trainer trainen zonder sportschool?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ja. Via de app kies je voor een personal trainer aan huis of online. Je traint waar je wil: thuis,
                buiten of in je eigen gym.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Wat kost een personal trainer via de app?</h3>
              <p className="text-gray-700 leading-relaxed">
                Je betaalt per sessie. Geen abonnement of verborgen kosten. Je kiest zelf wie je begeleidt en wanneer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Is dit een workout app of een personal trainer app?</h3>
              <p className="text-gray-700 leading-relaxed">
                Beide. Je gebruikt de app zelfstandig als gratis workout app of schakelt een gecertificeerde trainer in
                wanneer je begeleiding wil.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Werkt de app ook voor beginners?</h3>
              <p className="text-gray-700 leading-relaxed">
                Zeker. Onze fitness trainer opties en schema's zijn afgestemd op elk niveau. Geen ervaring nodig.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Kan ik trainen zonder internetverbinding?</h3>
              <p className="text-gray-700 leading-relaxed">
                Ja. Je kan je schema downloaden en offline volgen. Handig voor onderweg of op vakantie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
