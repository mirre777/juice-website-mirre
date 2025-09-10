"use client"

import Image from "next/image"
import { Dumbbell, GraduationCap, Clock, FlaskConical } from "lucide-react"

interface Feature {
  title: string
  description: string
}

interface CTAData {
  title: string
  subtitle: string
  bulletPoints: string[]
}

interface ClientFeaturesSectionProps {
  title: string
  features: Feature[]
  ctaData: CTAData
}

const getFeatureIcon = (title: string) => {
  if (title.includes("Complete Full Body Training")) {
    return <Dumbbell className="h-6 w-6 text-white" />
  }
  if (title.includes("Beginner to Intermediate")) {
    return <GraduationCap className="h-6 w-6 text-white" />
  }
  if (title.includes("Time Efficient")) {
    return <Clock className="h-6 w-6 text-white" />
  }
  if (title.includes("Science-Based")) {
    return <FlaskConical className="h-6 w-6 text-white" />
  }
  // fallback to dumbbell if no match
  return <Dumbbell className="h-6 w-6 text-white" />
}

export function ClientFeaturesSection({ title, features, ctaData }: ClientFeaturesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Features grid section */}
        <div className="text-center mb-40">
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

        {/* Program content overview section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">What's Inside the Program</h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Day 1 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-[#D2FF28] text-black font-bold text-xl py-3 px-4 rounded-lg mb-4 text-left">Day 1</div>
              <div className="space-y-3 text-left">
                <div className="text-sm">
                  <div className="font-semibold">Squat</div>
                  <div className="text-gray-600">Barbell • 3 sets • 6-8 reps</div>
                  <div className="text-gray-500 text-xs">Quads, Glutes</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Bench press</div>
                  <div className="text-gray-600">Barbell • 3 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Chest, Triceps</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">(Assisted) Pull-up</div>
                  <div className="text-gray-600">Bar/Machine • 3 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Back</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Wide-grip row</div>
                  <div className="text-gray-600">Cable • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Back</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Lateral raise</div>
                  <div className="text-gray-600">Dumbbells • 3 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Delts</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Hamstring curl</div>
                  <div className="text-gray-600">Machine • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Hamstrings</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Cable curls</div>
                  <div className="text-gray-600">Cable • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Biceps</div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-[#D2FF28] text-black font-bold text-xl py-3 px-4 rounded-lg mb-4 text-left">Day 2</div>
              <div className="space-y-3 text-left">
                <div className="text-sm">
                  <div className="font-semibold">Deadlift</div>
                  <div className="text-gray-600">Barbell • 3 sets • 5-8 reps</div>
                  <div className="text-gray-500 text-xs">Hamstrings, Glutes</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Shoulder press</div>
                  <div className="text-gray-600">Dumbbells • 3 sets • 6-8 reps</div>
                  <div className="text-gray-500 text-xs">Delts, Chest</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Leg press</div>
                  <div className="text-gray-600">Machine • 2 sets • 8-10 reps</div>
                  <div className="text-gray-500 text-xs">Quads, Glutes</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">T-bar rows</div>
                  <div className="text-gray-600">T-bar • 3 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Back</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Pec deck</div>
                  <div className="text-gray-600">Machine • 3 sets • 5-8 reps</div>
                  <div className="text-gray-500 text-xs">Chest</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Rear delt fly</div>
                  <div className="text-gray-600">Cable • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Delts</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Overhead extension</div>
                  <div className="text-gray-600">Cable • 3 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Triceps</div>
                </div>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-[#D2FF28] text-black font-bold text-xl py-3 px-4 rounded-lg mb-4 text-left">Day 3</div>
              <div className="space-y-3 text-left">
                <div className="text-sm">
                  <div className="font-semibold">Chest press</div>
                  <div className="text-gray-600">Machine • 3 sets • 5-8 reps</div>
                  <div className="text-gray-500 text-xs">Chest</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Lat pulldowns</div>
                  <div className="text-gray-600">Cable • 3 sets • 5-8 reps</div>
                  <div className="text-gray-500 text-xs">Back</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Leg extensions</div>
                  <div className="text-gray-600">Machine • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Quads</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Incline press</div>
                  <div className="text-gray-600">Dumbbells • 3 sets • 6-8 reps</div>
                  <div className="text-gray-500 text-xs">Chest, Delts</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Cable lateral raise</div>
                  <div className="text-gray-600">Cable • 3 sets • 10-12 reps</div>
                  <div className="text-gray-500 text-xs">Delts</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Preacher Curls</div>
                  <div className="text-gray-600">(EZ) Bar • 2 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Biceps</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Calf raises</div>
                  <div className="text-gray-600">Machine • 4 sets • 8-12 reps</div>
                  <div className="text-gray-500 text-xs">Calves</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="https://app.juice.fitness/public/programs/76d24001-bf04-40d1-8976-fa20c93a30cc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 hover:scale-105"
            >
              Get Free Program
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">{ctaData.title}</h2>

          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-700">{ctaData.subtitle}</p>
            {ctaData.bulletPoints.map((point, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <Dumbbell className="h-5 w-5 text-black flex-shrink-0" />
                <p className="text-lg text-gray-600">{point}</p>
              </div>
            ))}
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
            <span className="text-gray-600">5/5 by our moms 👵🏿</span>
          </div>
        </div>
      </div>
    </section>
  )
}
