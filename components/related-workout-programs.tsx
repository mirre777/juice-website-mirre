import Link from "next/link"
import Image from "next/image"
import { Clock, Dumbbell } from "lucide-react"

interface WorkoutProgram {
  slug: string
  title: string
  image: string
  isPaid: boolean
  price?: string
  duration: string
  equipment: string
}

interface RelatedWorkoutProgramsProps {
  currentSlug: string
}

const workoutPrograms: WorkoutProgram[] = [
  {
    slug: "3-day-full-body",
    title: "3-Day Full Body Workout",
    image: "/full-body-workout-dumbbells-gym.jpg",
    isPaid: false,
    duration: "3 days/week",
    equipment: "Dumbbells & Bodyweight",
  },
  {
    slug: "dumbbell-workout",
    title: "Push/Pull/Legs Dumbbell Program",
    image: "/dumbbell-workout-push-pull-legs-gym.jpg",
    isPaid: true,
    price: "€2",
    duration: "6 days/week",
    equipment: "Dumbbells Only",
  },
]

export function RelatedWorkoutPrograms({ currentSlug }: RelatedWorkoutProgramsProps) {
  // Filter out current program and get related programs
  const relatedPrograms = workoutPrograms.filter((program) => program.slug !== currentSlug)

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
            <div className="relative h-48 overflow-hidden">
              <Image
                src={program.image || "/placeholder.svg"}
                alt={program.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    program.isPaid ? "bg-juice text-black" : "bg-green-500 text-white"
                  }`}
                >
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
                  <span>{program.equipment}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
