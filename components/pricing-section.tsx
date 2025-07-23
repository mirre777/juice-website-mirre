const PricingSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Choose Your Perfect Plan</h2>
        <div className="flex flex-wrap justify-center">
          {/* Basic Plan */}
          <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <p className="text-gray-600 mb-4">Ideal for individuals and small teams.</p>
              <div className="text-2xl font-bold mb-4">€19</div>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Limited Support</li>
              </ul>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Get Started
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p className="text-gray-600 mb-4">For growing businesses with advanced needs.</p>
              <div className="text-2xl font-bold mb-4">€29</div>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>All Basic Features</li>
                <li>Advanced Feature 1</li>
                <li>Priority Support</li>
              </ul>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Get Started
              </button>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Elite</h3>
              <p className="text-gray-600 mb-4">The ultimate solution for enterprise-level organizations.</p>
              <div className="text-2xl font-bold mb-4">€69</div>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>All Pro Features</li>
                <li>Dedicated Support</li>
                <li>Custom Integrations</li>
              </ul>
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Changed from default export to named export
export { PricingSection }
