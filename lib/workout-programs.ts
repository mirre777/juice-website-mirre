export interface WorkoutProgram {
  slug: string
  title: string
  excerpt: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  isPaid: boolean
  isCelebrity: boolean
  image?: string
  ctaUrl: string
}

export function getAllWorkoutPrograms(): WorkoutProgram[] {
  return [
    {
      slug: "3-day-full-body",
      title: "3-Day Full Body Workout Program",
      excerpt:
        "Transform your fitness with our scientifically-designed 3-day full body workout program. Perfect for beginners and intermediate lifters looking to build strength and muscle.",
      category: "Full Body",
      difficulty: "Beginner",
      duration: "3 days/week",
      isPaid: false,
      isCelebrity: false,
      image: "/images/workout-program.png",
      ctaUrl: "https://app.juice.fitness/programs/76d24001-bf04-40d1-8976-fa20c93a30cc",
    },
    {
      slug: "dumbbell-workout",
      title: "Complete Dumbbell Workout Program",
      excerpt:
        "Build muscle and strength with just dumbbells. A comprehensive program designed for home or gym training with progressive overload principles.",
      category: "Dumbbell",
      difficulty: "Intermediate",
      duration: "4 days/week",
      isPaid: true,
      isCelebrity: false,
      image: "/images/workout-logging.png",
      ctaUrl: "https://app.juice.fitness/programs/dumbbell-workout",
    },
    {
      slug: "arnold-schwarzenegger-workout",
      title: "Arnold Schwarzenegger's Classic Mass Building Program",
      excerpt:
        "Train like the legend himself with Arnold's proven mass-building routine. This program combines his classic training principles with modern exercise science.",
      category: "Bodybuilding",
      difficulty: "Advanced",
      duration: "6 days/week",
      isPaid: true,
      isCelebrity: true,
      image: "/images/workout-program.png",
      ctaUrl: "https://app.juice.fitness/programs/arnold-schwarzenegger-workout",
    },
  ]
}

export function getWorkoutProgramBySlug(slug: string): WorkoutProgram | undefined {
  return getAllWorkoutPrograms().find((program) => program.slug === slug)
}

export function getWorkoutProgramsByCategory(category: string): WorkoutProgram[] {
  return getAllWorkoutPrograms().filter((program) => program.category === category)
}

export function getWorkoutProgramsByDifficulty(difficulty: string): WorkoutProgram[] {
  return getAllWorkoutPrograms().filter((program) => program.difficulty === difficulty)
}
