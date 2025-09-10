"use client"

interface FAQ {
  question: string
  answer: string
}

interface ClientFAQSectionProps {
  title: string
  faqs: FAQ[]
}

export function ClientFAQSection({ title, faqs }: ClientFAQSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">{title}</h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3
                  className="text-xl font-bold mb-3 text-gray-900"
                  style={{ color: "#111827", backgroundColor: "transparent" }}
                >
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
