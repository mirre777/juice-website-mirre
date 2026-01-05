interface FAQ {
  question: string
  answer: string
}

interface HomepageFAQSectionProps {
  faqs: FAQ[]
}

export function HomepageFAQSection({ faqs }: HomepageFAQSectionProps) {
  return (
    <section className="pt-12 md:pt-16 pb-16 md:pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[36px] font-semibold text-center mb-12 font-inter">
            Frequently Asked Questions
          </h2>

          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <dt className="font-sen font-semibold text-lg mb-3 text-black">
                  {faq.question}
                </dt>
                <dd className="text-gray-600 font-inter leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

