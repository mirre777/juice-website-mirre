"use client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, BarChart3, Smartphone, Zap, Target } from "lucide-react"

export function FeaturesSection() {
  const { isCoach } = useTheme()

  const coachFeatures = [
    {
      id: "clients",
      label: "Client Management",
      icon: Users,
      title: "Manage All Your Clients",
      description: "Keep track of client progress, workouts, and goals in one place.",
      features: [
        "Client profiles and progress tracking",
        "Workout history and analytics",
        "Goal setting and milestone tracking",
        "Communication tools",
      ],
    },
    {
      id: "workouts",
      label: "Workout Builder",
      icon: Calendar,
      title: "Create Custom Workouts",
      description: "Build personalized workout plans with our intuitive drag-and-drop interface.",
      features: [
        "Exercise library with 1000+ exercises",
        "Custom workout templates",
        "Progressive overload tracking",
        "Video demonstrations",
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      title: "Track Performance",
      description: "Get insights into client progress and business metrics.",
      features: ["Client progress reports", "Business analytics dashboard", "Revenue tracking", "Performance insights"],
    },
  ]

  const clientFeatures = [
    {
      id: "tracking",
      label: "Workout Tracking",
      icon: Smartphone,
      title: "Log Your Workouts",
      description: "Simple and intuitive workout logging with progress tracking.",
      features: [
        "Easy workout logging",
        "Progress photos and measurements",
        "Personal records tracking",
        "Workout history",
      ],
    },
    {
      id: "plans",
      label: "Training Plans",
      icon: Target,
      title: "Personalized Plans",
      description: "Get custom workout plans tailored to your goals.",
      features: [
        "AI-powered workout recommendations",
        "Goal-based training programs",
        "Adaptive difficulty scaling",
        "Progress-based adjustments",
      ],
    },
    {
      id: "motivation",
      label: "Stay Motivated",
      icon: Zap,
      title: "Achieve Your Goals",
      description: "Stay motivated with achievements, streaks, and community support.",
      features: [
        "Achievement badges and streaks",
        "Community challenges",
        "Progress celebrations",
        "Motivational insights",
      ],
    },
  ]

  const features = isCoach ? coachFeatures : clientFeatures

  return (
    <section className={`py-20 ${isCoach ? "bg-gray-50" : "bg-zinc-900"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${isCoach ? "text-black" : "text-white"}`}>
            {isCoach ? "Everything You Need to Coach" : "Everything You Need to Train"}
          </h2>
          <p className={`text-xl ${isCoach ? "text-gray-600" : "text-gray-400"} max-w-3xl mx-auto`}>
            {isCoach
              ? "Powerful tools designed specifically for personal trainers to manage clients and grow their business."
              : "Simple, effective tools to track your workouts, monitor progress, and achieve your fitness goals."}
          </p>
        </div>

        <Tabs defaultValue={features[0].id} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {features.map((feature) => (
              <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                <feature.icon size={16} />
                {feature.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id}>
              <Card className={`${isCoach ? "bg-white" : "bg-zinc-800 border-zinc-700"}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 ${isCoach ? "text-black" : "text-white"}`}>
                    <feature.icon size={24} className="text-orange-500" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription className={`${isCoach ? "text-gray-600" : "text-gray-400"}`}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <ul className="space-y-3">
                        {feature.features.map((item, index) => (
                          <li
                            key={index}
                            className={`flex items-center gap-3 ${isCoach ? "text-gray-700" : "text-gray-300"}`}
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white">Learn More</Button>
                    </div>
                    <div
                      className={`${isCoach ? "bg-gray-100" : "bg-zinc-700"} rounded-lg p-6 flex items-center justify-center`}
                    >
                      <feature.icon size={64} className="text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
