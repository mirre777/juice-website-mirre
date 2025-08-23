"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { StatisticsScreen } from "./statistics-screen"
import Image from "next/image"
import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export function HowItWorks() {
  const { isCoach, setIsCoach } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const isPersonalTrainerAppPage = pathname === "/personal-trainer-app" || pathname === "/workout-program-app"

  const clientSteps = [
    {
      title: "Get a program from your trainer",
      description:
        "Access personalized workout programs created by your trainer, or choose from our free programs to get started.",
      image: "/images/workout-program-new.png",
      isCustomImage: true,
    },
    {
      title: "Track workouts",
      description: "Log your workouts, track your progress, and share results directly with your trainer.",
      image: "/images/workout-logging-new.png",
      isCustomImage: true,
    },
    {
      title: "Get feedback and see results",
      description:
        "Receive real-time feedback from your trainer and track your progress with detailed statistics and insights.",
      image: "/images/statistics-new.png",
      isCustomImage: true,
    },
  ]

  const trainerSteps = [
    {
      title: "See client workouts anytime",
      description: "Even without an account. Clients can share their workout progress with you via a simple link.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-04%20at%2019.49.21-XnrWtZYmqveZeYpIb6JMeMMWuqDPCF.png",
      isStatisticsScreen: false,
    },
    {
      title: "Invite clients",
      description: "Easily invite and onboard your existing clients to the platform with a simple link.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-04%20at%2019.43.48-ZEkpRNsl8XtwR2jmYvTTrM424Z2FGL.png",
      isStatisticsScreen: false,
    },
    {
      title: "Create programs",
      description: "Design custom workout programs and nutrition plans for each client based on their goals.",
      images: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gZGWzN35sY81NbpTjGeGxYRLzemp48.png",
          alt: "Workout Program Builder",
        },
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kyaEofnzNBcUDCovMaKspmcFSFcB49.png",
          alt: "Choose a Template",
        },
      ],
      isMultiImage: true,
    },
    {
      title: "Monitor & adjust",
      description: "Track client progress in real-time and make data-driven adjustments to optimize results.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/52438241-D498-4E4C-8890-881052560206_1_105_c-PgGNfmwYLk2ybjSvWuTddBZgp7jcXo.jpeg",
      isCustomImage: true,
    },
  ]

  // Custom hook for video autoplay on visibility
  const VideoPlayer = ({ src, className }: { src: string; className?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && videoRef.current) {
              videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e))
            } else if (videoRef.current) {
              videoRef.current.pause()
            }
          })
        },
        { threshold: 0.5 },
      )

      if (videoRef.current) {
        observer.observe(videoRef.current)
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current)
        }
      }
    }, [])

    return <video ref={videoRef} src={src} className={className} muted loop playsInline controls={false} />
  }

  return (
    <section
      id="how-it-works"
      className={`pt-8 pb-0 ${isCoach ? "bg-white" : "bg-black"} scroll-mt-16 maintain-scroll`}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <span className={`${isCoach ? "text-black" : "text-white"} font-medium mb-3`}>HOW IT WORKS</span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            Simple setup, powerful results
          </h2>
          <p className={`${isCoach ? "text-gray-600" : "text-gray-400"} max-w-2xl`}>
            Our streamlined platform makes fitness training and progress tracking effortless for both trainers and
            clients.
          </p>
        </div>

        {!isPersonalTrainerAppPage ? (
          <Tabs
            defaultValue="client"
            value={isCoach ? "trainer" : "client"}
            onValueChange={(value) => {
              if (value === "trainer") {
                router.push("/#how-it-works")
              } else {
                router.push("/clients#how-it-works")
              }
            }}
            className="w-full max-w-5xl mx-auto"
          >
            

            <TabsContent value="client" className="mt-0 min-h-[450px]">
              <div className="space-y-4 md:space-y-2">
                {clientSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-2 items-center py-0`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-juice text-black font-bold">
                          {index + 1}
                        </div>
                        <h3 className={`text-2xl font-bold ${isCoach ? "text-black" : "text-white"}`}>{step.title}</h3>
                      </div>
                      <p className="text-zinc-400 mb-3">{step.description}</p>
                      <div className="h-1 w-20 bg-juice rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="relative rounded-xl overflow-hidden shadow-lg bg-transparent border-0">
                        {step.isCustomImage ? (
                          <div className="flex justify-center py-2 bg-transparent">
                            <div className="relative w-[280px] h-[560px] md:w-[320px] md:h-[640px]">
                              <Image
                                src={step.image || "/placeholder.svg"}
                                alt={step.title}
                                fill
                                className="object-contain object-center rounded-2xl"
                                style={{ objectFit: "contain", objectPosition: "center" }}
                              />
                            </div>
                          </div>
                        ) : step.isStatisticsScreen ? (
                          <div className="flex justify-center py-4 bg-black">
                            <StatisticsScreen />
                          </div>
                        ) : (
                          <img
                            src={step.image || "/placeholder.svg"}
                            alt={step.title}
                            className="w-full h-auto object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trainer" className="mt-0 min-h-[450px]">
              <div className="space-y-16">
                {trainerSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-juice text-black font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-zinc-400 mb-6">{step.description}</p>
                      <div className="h-1 w-20 bg-juice rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="relative rounded-xl overflow-hidden shadow-lg bg-transparent border-0">
                        {step.isMultiImage ? (
                          <div className="flex flex-col gap-4 py-4">
                            {step.images?.map((image, imgIndex) => (
                              <div key={imgIndex} className="bg-white rounded-xl p-2 shadow-md">
                                <Image
                                  src={image.src || "/placeholder.svg"}
                                  alt={image.alt}
                                  width={500}
                                  height={350}
                                  className="w-full h-auto object-contain rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                        ) : step.isCustomImage ? (
                          <div className="flex justify-center py-4 bg-white rounded-xl">
                            <Image
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              width={600}
                              height={800}
                              className="w-full h-auto object-contain rounded-xl"
                            />
                          </div>
                        ) : (
                          <img
                            src={step.image || "/placeholder.svg"}
                            alt={step.title}
                            className="w-full h-auto object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="w-full max-w-5xl mx-auto">
            <div className="space-y-16">
              {trainerSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-juice text-black font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-zinc-400 mb-6">{step.description}</p>
                    <div className="h-1 w-20 bg-juice rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="relative rounded-xl overflow-hidden shadow-lg bg-transparent border-0">
                      {step.isMultiImage ? (
                        <div className="flex flex-col gap-4 py-4">
                          {step.images?.map((image, imgIndex) => (
                            <div key={imgIndex} className="bg-white rounded-xl p-2 shadow-md">
                              <Image
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                width={500}
                                height={350}
                                className="w-full h-auto object-contain rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      ) : step.isCustomImage ? (
                        <div className="flex justify-center py-4 bg-white rounded-xl">
                          <Image
                            src={step.image || "/placeholder.svg"}
                            alt={step.title}
                            width={600}
                            height={800}
                            className="w-full h-auto object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <img
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          className="w-full h-auto object-contain"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
