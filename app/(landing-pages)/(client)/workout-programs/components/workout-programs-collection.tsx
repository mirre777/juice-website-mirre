"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, X } from "lucide-react"
import { useState } from "react"
import type { WorkoutProgram } from "@/lib/workout-programs"

interface WorkoutProgramsClientProps {
  programs: WorkoutProgram[]
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="

export function WorkoutProgramsClient({ programs }: WorkoutProgramsClientProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [showAllPrograms, setShowAllPrograms] = useState(true)

  const programTypes = ["Free", "Paid"]

  const filteredPrograms = showAllPrograms
    ? programs
    : programs.filter((program) => {
        const programType = program.isPaid ? "Paid" : "Free"
        return selectedTypes.includes(programType)
      })

  const toggleType = (type: string) => {
    setShowAllPrograms(false)
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const selectAllPrograms = () => {
    setShowAllPrograms(true)
    setSelectedTypes([])
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setShowAllPrograms(true)
  }

  return (
    <>
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {/* All Programs button */}
          <Button
            variant={showAllPrograms ? "default" : "outline"}
            className={
              showAllPrograms
                ? "bg-juice text-juice-foreground hover:bg-juice/90"
                : "border-gray-700 hover:bg-gray-800 text-gray-300 bg-transparent"
            }
            onClick={selectAllPrograms}
          >
            All Programs
          </Button>

          {programTypes.map((type) => (
            <Button
              key={type}
              variant={!showAllPrograms && selectedTypes.includes(type) ? "default" : "outline"}
              className={
                !showAllPrograms && selectedTypes.includes(type)
                  ? "bg-juice text-juice-foreground hover:bg-juice/90"
                  : "border-gray-700 hover:bg-gray-800 text-gray-300 bg-transparent"
              }
              onClick={() => toggleType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Clear all filters button */}
        {!showAllPrograms && selectedTypes.length > 0 && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Workout Programs */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <Link
              key={program.slug}
              href={`/workout-programs/${program.isPaid ? "paid" : "free"}/${program.slug}`}
              className="block"
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border-gray-800 bg-gray-900 h-full cursor-pointer">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={program.image || "/images/workout-program.png"}
                    alt={program.title}
                    width={400}
                    height={240}
                    priority={true}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-juice text-juice-foreground">{program.difficulty}</Badge>
                    {program.isPaid && <Badge className="bg-black text-white">Premium</Badge>}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-white group-hover:text-juice transition-colors line-clamp-2">
                    {program.title}
                  </CardTitle>
                  <div className="text-sm text-gray-400">{program.duration}</div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <CardDescription className="text-gray-400 mb-4 line-clamp-3 flex-1">
                    {program.excerpt}
                  </CardDescription>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto font-semibold text-white hover:text-juice hover:bg-transparent"
                    >
                      View Program
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No programs found</h3>
            <p className="text-lg text-gray-400 mb-8">
              {!showAllPrograms && selectedTypes.length === 0
                ? "Select a program type to see programs."
                : "No programs match the selected filters. Try selecting different program types."}
            </p>
            <Button onClick={selectAllPrograms} className="bg-juice text-juice-foreground hover:bg-juice/90">
              Show All Programs
            </Button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {filteredPrograms.length > 0 && (
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-800">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Start Training?</h3>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Download the Juice app and get instant access to all our workout programs. Track your progress, log your
            workouts, and achieve your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
        </div>
      )}
    </>
  )
}
