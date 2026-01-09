export default function WorkoutPlannerHero() {
  return (
    <section className="relative py-8 md:py-16 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content - Order 2 on mobile, 1 on desktop */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Effortless Workout Planning
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Streamline your program creation and management.{" "}
                <span className="bg-[#CCFF00] px-2 py-1 rounded text-gray-600">
                  Convert complex spreadsheets into actionable workout plans with ease.
                </span>
              </p>
            </div>

            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-base sm:text-lg text-gray-700">Upload your Google Sheets program</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-base sm:text-lg text-gray-700">Automatically converted to mobile app</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-base sm:text-lg text-gray-700">Share with clients instantly</span>
              </li>
            </ul>

            <div className="pt-4 lg:pt-6">
              <a
                href="https://app.juice.fitness/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto text-center trainer-gradient-btn px-8 py-4 rounded-full font-semibold transition-colors text-lg"
              >
                Start Converting Programs
              </a>
            </div>
          </div>

          {/* Video - Order 1 on mobile, 2 on desktop */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
              <video
                className="w-full h-full rounded-lg shadow-2xl object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/convertyourworkouts.png"
                style={{ aspectRatio: "16/9" }}
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/convert%20a%20workout%20program%20from%20google%20sheets%20into%20client%20mobile%20app%20%28online-video-cutter.com%29-i3nXqd4V9O1pZUnAozCN7JUJB8hORF.mp4"
                  type="video/mp4"
                />
                <img
                  src="https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/convertyourworkouts.png"
                  alt="Workout planner - Convert Google Sheets to workout programs"
                  className="w-full h-full rounded-lg shadow-2xl object-cover"
                  style={{ aspectRatio: "16/9" }}
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
