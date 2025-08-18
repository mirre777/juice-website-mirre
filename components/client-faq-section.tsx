"use client"

export function ClientFAQSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">FAQ</h2>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Welche ist die beste kostenlose Fitness App?</h3>
              <p className="text-gray-700 leading-relaxed">
                Unsere App bietet dir Training ohne Abo und ist komplett gratis nutzbar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Brauche ich Geräte für die Workouts?</h3>
              <p className="text-gray-700 leading-relaxed">
                Nein. Alle Übungen sind mit dem eigenen Körpergewicht möglich.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Kann ich einen Trainingsplan erstellen?</h3>
              <p className="text-gray-700 leading-relaxed">
                Ja. Mit unserer Trainingsplan App bekommst du dein persönliches Programm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Funktioniert die App offline?</h3>
              <p className="text-gray-700 leading-relaxed">Ja. Lade deinen Plan runter und trainiere überall.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Ist die App für Anfänger geeignet?</h3>
              <p className="text-gray-700 leading-relaxed">
                Absolut. Unsere Fitness App bietet Übungen für jedes Level - von Einsteiger bis Fortgeschrittene.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-black">Gibt es versteckte Kosten?</h3>
              <p className="text-gray-700 leading-relaxed">
                Nein. Die App ist komplett kostenlos. Transparent: keine versteckten Kosten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
