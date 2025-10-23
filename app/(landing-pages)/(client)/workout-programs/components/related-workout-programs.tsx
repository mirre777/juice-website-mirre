"use client"

import Link from "next/link"
import { Dumbbell, Activity, Star } from "lucide-react"

interface WorkoutProgram {
  title: string
  slug: string
  isPaid: boolean
  isCelebrity: boolean
  daysPerWeek: number
  equipment: string
  icon: "dumbbell" | "fullbody" | "celebrity"
}

interface RelatedWorkoutProgramsProps {
  currentSlug: string
}

const workoutPrograms: WorkoutProgram[] = [
  {
    title: "3-Day Full Body Workout Program",
    slug: "3-day-full-body",
    isPaid: false,
    isCelebrity: false,
    daysPerWeek: 3,
    equipment: "Gym Equipment",
    icon: "fullbody",
  },
  {
    title: "Push/Pull/Legs Dumbbell Program",
    slug: "dumbbell-workout",
    isPaid: true,
    isCelebrity: false,
    daysPerWeek: 6,
    equipment: "Dumbbells Only",
    icon: "dumbbell",
  },
  {
    title: "Jeff Nippard's Free Minimalist Workout",
    slug: "jeff-nippard-free-minimalist-workout",
    isPaid: false,
    isCelebrity: true,
    daysPerWeek: 3,
    equipment: "Gym Equipment",
    icon: "celebrity",
  },
]

export function RelatedWorkoutPrograms({ currentSlug }: RelatedWorkoutProgramsProps) {
  const relatedPrograms = workoutPrograms.filter((program) => program.slug !== currentSlug)

  if (relatedPrograms.length === 0) return null

  const handleProgramClick = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Other Workout Programs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPrograms.map((program) => (
          <Link
            key={program.slug}
            href={`/workout-programs/${program.isCelebrity ? "celebrity" : program.isPaid ? "paid" : "free"}/${program.slug}`}
            className="group block"
            onClick={handleProgramClick}
          >
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-gray-300">
              {/* Icon Section */}
              <div className="relative bg-white h-36 flex items-center justify-center">
                <div className="absolute top-4 left-4 flex gap-1">
                  {program.isCelebrity && (
                    <span className="bg-yellow-500 text-black text-sm font-medium px-2 py-1 rounded-full">
                      Celebrity
                    </span>
                  )}
                  {program.isPaid && (
                    <span className="bg-black text-white text-sm font-medium px-2 py-1 rounded-full">
                      Paid
                    </span>
                  )}
                  {!program.isPaid && (
                    <span className="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <div className="text-black">
                  {program.icon === "dumbbell" ? (
                    <Dumbbell size={64} strokeWidth={1.5} />
                  ) : program.icon === "celebrity" ? (
                    <Star size={64} strokeWidth={1.5} />
                  ) : (
                    <Activity size={64} strokeWidth={1.5} />
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {program.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>3-6 days/week</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span>{program.equipment}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
