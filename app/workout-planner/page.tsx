import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WorkoutPlannerHero from "@/components/workout-planner-hero" // Import the new component

export const metadata = {
  title: "Juice Workout Planner | Build Custom Fitness Programs for Clients",
  description:
    "Design and deliver personalized workout programs with the Juice Workout Planner. Streamline program creation for personal trainers and fitness coaches.",
  openGraph: {
    images: "/images/og-feature-graphic.png",
  },
}

export default function WorkoutPlannerPage() {
  // Using isCoach=true for trainer-style (white background) navbar
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar isHomePage={false} isCoach={true} />
      <WorkoutPlannerHero /> {/* Use the new hero component */}
      <Footer />
    </main>
  )
}
