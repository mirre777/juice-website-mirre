import { CheckCircle, Clock, Code, Rocket } from "lucide-react"

const PersonalTrainerWebsitePage = () => {
  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Build Your Personal Trainer Website in Minutes</h1>
        <p className="text-gray-600 mb-8">Reach more clients and grow your business with a professional website.</p>
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-gray-700 font-medium">Easy to Use</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-gray-700 font-medium">Super fast</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-gray-700 font-medium">Mobile Optimized</span>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started Now
        </button>
      </section>

      {/* Features Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-4 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 border rounded-lg shadow-md">
            <Code className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-xl font-semibold mb-2">Customizable Templates</h3>
            <p className="text-gray-600">
              Choose from a variety of professionally designed templates to create a website that reflects your brand.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 border rounded-lg shadow-md">
            <Clock className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-xl font-semibent mb-2">Online Booking</h3>
            <p className="text-gray-600">
              Allow clients to easily book appointments and training sessions directly through your website.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 border rounded-lg shadow-md">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="text-xl font-semibold mb-2">Payment Integration</h3>
            <p className="text-gray-600">Securely accept payments online with integrated payment gateways.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8">
          Create your personal trainer website today and start attracting more clients.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up Now</button>
      </section>
    </div>
  )
}

export default PersonalTrainerWebsitePage
