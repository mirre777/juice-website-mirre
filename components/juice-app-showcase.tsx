"use client"

import Image from "next/image"

export function JuiceAppShowcase() {
  return (
    <section className="py-16 bg-gray-50 border border-gray-200 rounded-2xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Mobile App Mockups */}
          <div className="flex-1 flex justify-center gap-6">
            <div className="relative">
              <div className="w-64 h-[520px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  <Image
                    src="/images/workout-program-new.png"
                    alt="Juice App - Workout Programs"
                    width={240}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="relative mt-8">
              <div className="w-64 h-[520px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  <Image
                    src="/images/workout-logging-new.png"
                    alt="Juice App - Workout Tracking"
                    width={240}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl font-bold text-black mb-6">Juice Fitness App</h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              The Juice app gives you insight into your complete fitness journey. Track your workouts step by step and
              see how you improve over time. Juice helps you achieve your goals! This free app is your personal coach,
              developing healthy habits that fit your lifestyle in an easy and fun way. Even if you're not a fitness
              enthusiast.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://apps.apple.com/us/app/juice-fitness-app/id6744974452"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Download_on_the_App_Store_Badge_US-UK_RGB_blk.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={54}
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
                  width={180}
                  height={54}
                  className="h-14 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
