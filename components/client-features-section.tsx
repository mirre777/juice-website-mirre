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

          <div className="max-w-6xl mx-auto bg-gray-50 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#D2FF28] text-black">
                  <th className="px-4 py-3 font-bold">Day</th>
                  <th className="px-4 py-3 font-bold">Exercise</th>
                  <th className="px-4 py-3 font-bold">Equipment</th>
                  <th className="px-4 py-3 font-bold">Sets</th>
                  <th className="px-4 py-3 font-bold">Reps</th>
                  <th className="px-4 py-3 font-bold">Muscle Group</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-200">
                  <td rowSpan={7} className="px-4 py-3 font-semibold text-black border-r border-gray-200">
                    Day 1
                  </td>
                  <td className="px-4 py-3">Squat</td>
                  <td className="px-4 py-3">Barbell</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">6-8</td>
                  <td className="px-4 py-3">Quads, Glutes</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Bench press</td>
                  <td className="px-4 py-3">Barbell</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Chest, Triceps</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">(Assisted) Pull-up</td>
                  <td className="px-4 py-3">Bar / Machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Back</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Wide-grip row</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Back</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Lateral raise</td>
                  <td className="px-4 py-3">Dumbbells</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Delts</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Hamstring curl</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Hamstrings</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-3">Cable curls</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Biceps</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td rowSpan={7} className="px-4 py-3 font-semibold text-black border-r border-gray-200">
                    Day 2
                  </td>
                  <td className="px-4 py-3">Deadlift</td>
                  <td className="px-4 py-3">Barbell</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">5-8</td>
                  <td className="px-4 py-3">Hamstrings, Glutes</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Shoulder press</td>
                  <td className="px-4 py-3">Dumbbells</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">6-8</td>
                  <td className="px-4 py-3">Delts, Chest</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Leg press</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-10</td>
                  <td className="px-4 py-3">Quads, Glutes</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">T-bar rows</td>
                  <td className="px-4 py-3">T-bar</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Back</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Pec deck</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">5-8</td>
                  <td className="px-4 py-3">Chest</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Rear delt fly</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Delts</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-3">Overhead extension</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Triceps</td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td rowSpan={7} className="px-4 py-3 font-semibold text-black border-r border-gray-200">
                    Day 3
                  </td>
                  <td className="px-4 py-3">Chest press</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">5-8</td>
                  <td className="px-4 py-3">Chest</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Lat pulldowns</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">5-8</td>
                  <td className="px-4 py-3">Back</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Leg extensions</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Quads</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Incline press</td>
                  <td className="px-4 py-3">Dumbbells</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">6-8</td>
                  <td className="px-4 py-3">Chest, Delts</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Cable lateral raise</td>
                  <td className="px-4 py-3">Cable machine</td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">10-12</td>
                  <td className="px-4 py-3">Delts</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">Preacher Curls</td>
                  <td className="px-4 py-3">(EZ) Bar</td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Biceps</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Calf raises</td>
                  <td className="px-4 py-3">Machine</td>
                  <td className="px-4 py-3">4</td>
                  <td className="px-4 py-3">8-12</td>
                  <td className="px-4 py-3">Calves</td>
                </tr>
              </tbody>
            </table>
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
