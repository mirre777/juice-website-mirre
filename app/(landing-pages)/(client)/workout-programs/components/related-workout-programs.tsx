import Link from "next/link"
import { Clock, Dumbbell, User } from "lucide-react"
import { getAllWorkoutPrograms } from "@/lib/workout-programs"

interface RelatedWorkoutProgramsProps {
  currentSlug: string
}

export function RelatedWorkoutPrograms({ currentSlug }: RelatedWorkoutProgramsProps) {
  const relatedPrograms = getAllWorkoutPrograms().filter((program) => program.slug !== currentSlug)

  if (relatedPrograms.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Other Workout Programs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPrograms.map((program) => (
          <Link
            key={program.slug}
            href={`/workout-programs/${program.isPaid ? "paid" : "free"}/${program.slug}`}
            className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-48 bg-white flex items-center justify-center">
              <Dumbbell className="w-16 h-16 text-black" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-juice text-black">
                  {program.isPaid ? "Paid" : "Free"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-900 group-hover:text-juice transition-colors line-clamp-2 mb-4">
                {program.title}
              </h4>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" />
                  <span>Gym Equipment</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
