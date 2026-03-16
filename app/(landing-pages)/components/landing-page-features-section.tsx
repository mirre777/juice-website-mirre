"use client"
import Image from "next/image"
import { Activity, Calendar, Share2, Dumbbell } from "lucide-react"

interface Feature {
  title: string
  description: string
}

interface CTAData {
  title: string
  subtitle: string
  bulletPoints: string[]
  ctaButtonText?: string
  ctaButtonUrl?: string
}

interface LandingPageFeaturesSectionProps {
  title: string
  features: Feature[]
  ctaData: CTAData
}

const getFeatureIcon = (title: string) => {
  if (title.includes("Track Progress")) {
    return <Activity className="h-6 w-6 text-white" />
  }
  if (title.includes("Personal Workout Planner")) {
    return <Calendar className="h-6 w-6 text-white" />
  }
  if (title.includes("Free & Accessible")) {
    return <Dumbbell className="h-6 w-6 text-white" />
  }
  if (title.includes("Stay Motivated")) {
    return <Share2 className="h-6 w-6 text-white" />
  }
  // fallback to activity icon
  return <Activity className="h-6 w-6 text-white" />
}

export function LandingPageFeaturesSection({ title, features, ctaData }: LandingPageFeaturesSectionProps) {
  const handleCtaClick = () => {
    if (ctaData.ctaButtonUrl) {
      window.open(ctaData.ctaButtonUrl, "_blank")
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Features grid section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">{title}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-lime-500 rounded-full p-2">{getFeatureIcon(feature.title)}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">{ctaData.title}</h2>

          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700">{ctaData.subtitle}</p>
            <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-2">
              {ctaData.bulletPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-black flex-shrink-0" />
                  <p className="text-lg text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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

          <div className="flex items-center justify-center">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">5/5 by our users</span>
          </div>
        </div>
      </div>
    </section>
  )
}
